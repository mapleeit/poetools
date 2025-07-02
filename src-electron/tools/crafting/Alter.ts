import { clipboard } from 'electron'
import { Button } from 'app/shared/Button'
import { Key } from 'app/shared/Key'

import type { Equipment } from '../EquipmentParser';
import { EquipmentParser, EquipmentRarity, UNDEFINED_EQUIPMENT_DESCRIPTION } from '../EquipmentParser'
import { PositionManager } from '../PositionManager'
import { BaseTool } from '../BaseTool'
import { EquipmentProperty } from '../EquipmentProperty';
import { Notify } from '../Notify';
import type { Point } from 'app/shared/Point'

export interface AlterCondition {
  description: string
  min: number
  max: number
}

export class Alter extends BaseTool {
  protected equipmentParser = new EquipmentParser()
  protected positionManager = new PositionManager()
  protected notify = new Notify()

  protected times = 0;
  protected stopSignal = false;
  public altering = false

  public env = {
    orbs: {
      orbOfAlteration: 0,
      orbOfScouring: 0,
      augmentationOrb: 0,
      transmutationOrb: 0,
      knowledgeScroll: 0,
    }
  }

  constructor() {
    super('alter');
  }

  public async doBatchAlter({
    maxTimes = 0,
    conditions,
    position = this.positionManager.positions.item
  }: {
    maxTimes?: number,
    conditions: AlterCondition[]
    position?: Point
  }) {
    this.logger.info(`batch alter: start condition ${maxTimes === 0 ? 'Infinity' : `${maxTimes} times`}`)
    this.reset()

    await this.mouseAction.setMousePosition(position)
    await this.delay()
    const itemDescription = await this.readItemDescription(position)
    let equipment = this.equipmentParser.parseEquipment(itemDescription)
    if (this.validateConditions(equipment, conditions)) {
      this.logger.info('batch alter: start success')
      this.logger.debug(equipment)
      return equipment
    }

    await this.initEquipment(equipment, position);

    if (conditions.length === 0) {
      throw new Error('Conditions is required')
    }

    this.altering = true
    for (let i = 0; i < (maxTimes === 0 ? Infinity : maxTimes); i++) {
      if (this.stopSignal) {
        this.logger.info('batch alter: end by stop signal')
        this.altering = false
        this.stopSignal = false
        return
      }

      equipment = await this.alter(position)
      if (this.validateConditions(equipment, conditions)) {
        this.altering = false
        this.logger.info('batch alter: end success')
        return equipment
      }

      equipment = await this.augmentIfNeeded(equipment, position)
      if (this.validateConditions(equipment, conditions)) {
        this.altering = false
        this.logger.info('batch alter: end success')
        return equipment
      }
    }

    this.altering = false
    this.logger.info('batch alter: end fail')
  }

  public async detectEnvironment() {
    const setEnv = (name: string, count: number) => {
      switch (name) {
        case '改造石':
          this.env.orbs.orbOfAlteration = count
          break
        case '蜕变石':
          this.env.orbs.transmutationOrb = count
          break
        case '重铸石':
          this.env.orbs.orbOfScouring = count
          break
        case '增幅石':
          this.env.orbs.augmentationOrb = count
          break
        default:
          this.logger.error(`Unknown orb: ${name}`)
      }
    }

    const positions = [
      this.positionManager.positions.orbOfAlteration,
      this.positionManager.positions.orbOfScouring,
      this.positionManager.positions.augmentationOrb,
      this.positionManager.positions.transmutationOrb,
      this.positionManager.positions.knowledgeScroll,
    ];

    for await (const position of positions) {
      const itemDescription = await this.readItemDescription(position)
      this.logger.debug(itemDescription)
      const item = this.equipmentParser.parseEquipment(itemDescription);
      setEnv(item.name[0] ?? '', item.count)
    }

    this.logger.info(`batch alter: environment detected: ${JSON.stringify(this.env, null, 2)}`)
  }

  public stop() {
    this.stopSignal = true
  }

  private reset() {
    this.times = 0
  }

  // Set equipment to magic if it's not magic
  private async initEquipment(equipment: Equipment, position: Point = this.positionManager.positions.item) {
    if (equipment.properties.some(p => p.match(UNDEFINED_EQUIPMENT_DESCRIPTION))) {
      await this.useKnowledgeScroll(position)
    }

    switch (equipment.rarity) {
      case EquipmentRarity.MAGIC:
        return
      case EquipmentRarity.RARE:
        await this.useOrbOfScouring(position)
        await this.useTransmutationOrb(position)
        break
      case EquipmentRarity.NORMAL:
        await this.useTransmutationOrb(position)
        break
      default:
        throw new Error('Invalid equipment rarity')
    }
  }

  private async useKnowledgeScroll(position: Point = this.positionManager.positions.item) {
    if (this.env.orbs.knowledgeScroll === 0) {
      throw new Error('knowledge scroll is not enough')
    }

    await this.mouseAction.setMousePosition(this.positionManager.positions.knowledgeScroll)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(position)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()

    this.env.orbs.knowledgeScroll--
  }

  private async useOrbOfScouring(position: Point = this.positionManager.positions.item) {
    if (this.env.orbs.orbOfScouring === 0) {
      throw new Error('orb of scouring is not enough')
    }

    await this.mouseAction.setMousePosition(this.positionManager.positions.orbOfScouring)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(position)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()

    this.env.orbs.orbOfScouring--
  }

  private async useTransmutationOrb(position: Point = this.positionManager.positions.item) {
    if (this.env.orbs.transmutationOrb === 0) {
      throw new Error('transmutation orb is not enough')
    }

    await this.mouseAction.setMousePosition(this.positionManager.positions.transmutationOrb)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(position)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()

    this.env.orbs.transmutationOrb--
  }

  private async useOrbOfAlteration(position: Point = this.positionManager.positions.item) {
    if (this.env.orbs.orbOfAlteration === 0) {
      throw new Error('orb of alteration is not enough')
    }

    await this.mouseAction.setMousePosition(this.positionManager.positions.orbOfAlteration)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(position)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()

    this.env.orbs.orbOfAlteration--
  }

  private async useAugmentationOrb(position: Point = this.positionManager.positions.item) {
    if (this.env.orbs.augmentationOrb === 0) {
      throw new Error('augmentation orb is not enough')
    }

    await this.mouseAction.setMousePosition(this.positionManager.positions.augmentationOrb)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(position)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()

    this.env.orbs.augmentationOrb--
  }

  protected async readItemDescription(position: Point = this.positionManager.positions.item) {
    await this.mouseAction.setMousePosition(position)
    await this.delay()
    await clipboard.clear()
    await this.delay()
    await this.keyboardAction.click(Key.LeftControl, Key.C)
    await this.delay()
    const itemDescription = clipboard.readText()
    await this.delay()
    return itemDescription
  }

  private async alter(position: Point = this.positionManager.positions.item) {
    this.logger.info(`altering: start ${this.times}`)
    await this.useOrbOfAlteration(position)

    const itemDescription = await this.readItemDescription(position)
    this.logger.debug(itemDescription)
    this.logger.info(`altered: end ${this.times}`)

    const equipment = this.equipmentParser.parseEquipment(itemDescription);

    this.times++;
    return equipment;
  }

  private async augmentIfNeeded(equipment: Equipment, position: Point = this.positionManager.positions.item) {
    this.logger.info(`augment: start ${this.times}`)
    if (equipment.properties.length === 1) {
      this.logger.debug('item has only one property, use augmentation orb')
      await this.useAugmentationOrb(position)
    }

    const itemDescription = await this.readItemDescription(position)
    this.logger.debug(itemDescription)
    this.logger.info(`augmented: end ${this.times}`)

    return this.equipmentParser.parseEquipment(itemDescription);
  }

  protected validateConditions(equipment: Equipment, conditions: AlterCondition[]) {
    this.logger.debug(`Conditions: ${JSON.stringify(conditions, null, 2)}`)
    this.logger.debug(`Equipment: ${JSON.stringify(equipment, null, 2)}`)

    let result
    switch (equipment.rarity) {
      case EquipmentRarity.MAGIC:
        result = conditions
          .filter(condition => condition.description?.trim() !== '')
          .some(condition => [...equipment.properties, ...equipment.name].some(p => {
            if (p instanceof EquipmentProperty) {
              return p.match(condition.description, [condition.min, condition.max])
            }

            return p.includes(condition.description)
          }))

        this.logger.debug(`Validation: ${Boolean(result)}`)
        return result
      case EquipmentRarity.RARE:
        return false
      default:
        return false
    }
  }
}
