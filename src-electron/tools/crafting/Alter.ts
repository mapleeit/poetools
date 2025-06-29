import { clipboard } from 'electron'
import { Button } from 'app/shared/Button'
import { Key } from 'app/shared/Key'

import type { Equipment } from '../EquipmentParser';
import { EquipmentParser, EquipmentRarity, UNDEFINED_EQUIPMENT_DESCRIPTION } from '../EquipmentParser'
import { PositionManager } from '../PositionManager'
import { BaseTool } from '../BaseTool'
import { EquipmentProperty } from '../EquipmentProperty';
import { Notify } from '../Notify';

export interface AlterCondition {
  description: string
  min: number
  max: number
}

export class Alter extends BaseTool {
  private equipmentParser = new EquipmentParser()
  private positionManager = new PositionManager()
  private notify = new Notify()

  private times = 0;
  private stopSignal = false;
  public altering = false

  constructor() {
    super('alter');
  }

  public async batchAlter({
    maxTimes = 0,
    conditions
  }: {
    maxTimes?: number,
    conditions: AlterCondition[]
  }) {
    this.logger.info(`batch alter: start condition ${maxTimes === 0 ? 'Infinity' : `${maxTimes} times`}`)
    this.reset()

    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    const itemDescription = await this.readItemDescription()
    let equipment = this.equipmentParser.parseEquipment(itemDescription)
    if (this.validateConditions(equipment, conditions)) {
      this.notify.markdown({
        title: 'alter success',
        md: JSON.stringify(equipment, null, 2)
      })
      this.logger.info('batch alter: start success')
      this.logger.debug(equipment)
      return equipment
    }

    await this.initEquipment(equipment);

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

      equipment = await this.alter()
      if (this.validateConditions(equipment, conditions)) {
        this.altering = false
        this.notify.markdown({
          title: 'alter success',
          md: JSON.stringify(equipment, null, 2)
        })
        this.logger.info('batch alter: end success')
        return equipment
      }

      equipment = await this.augmentIfNeeded(equipment)
      if (this.validateConditions(equipment, conditions)) {
        this.altering = false
        this.notify.markdown({
          title: 'alter success',
          md: JSON.stringify(equipment, null, 2)
        })
        this.logger.info('batch alter: end success')
        return equipment
      }
    }

    this.altering = false
    this.logger.info('batch alter: end fail')
  }

  public stop() {
    this.stopSignal = true
  }

  private reset() {
    this.times = 0
  }

  // Set equipment to magic if it's not magic
  private async initEquipment(equipment: Equipment) {
    if (equipment.properties.some(p => p.match(UNDEFINED_EQUIPMENT_DESCRIPTION))) {
      await this.useKnowledgeScroll()
    }

    switch (equipment.rarity) {
      case EquipmentRarity.MAGIC:
        return
      case EquipmentRarity.RARE:
        await this.useOrbOfScouring()
        await this.useTransmutationOrb()
        break
      case EquipmentRarity.NORMAL:
        await this.useTransmutationOrb()
        break
      default:
        throw new Error('Invalid equipment rarity')
    }
  }

  private async useKnowledgeScroll() {
    await this.mouseAction.setMousePosition(this.positionManager.positions.knowledgeScroll)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async useOrbOfScouring() {
    await this.mouseAction.setMousePosition(this.positionManager.positions.orbOfScouring)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async useTransmutationOrb() {
    await this.mouseAction.setMousePosition(this.positionManager.positions.transmutationOrb)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async useOrbOfAlteration() {
    await this.mouseAction.setMousePosition(this.positionManager.positions.orbOfAlteration)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async useAugmentationOrb() {
    await this.mouseAction.setMousePosition(this.positionManager.positions.augmentationOrb)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async readItemDescription() {
    await this.mouseAction.setMousePosition(this.positionManager.positions.item)
    await this.delay()
    await this.keyboardAction.click(Key.LeftControl, Key.C)
    await this.delay()
    const itemDescription = clipboard.readText()
    await this.delay()
    return itemDescription
  }

  private async alter() {
    this.logger.info(`altering: start ${this.times}`)
    await this.useOrbOfAlteration()

    const itemDescription = await this.readItemDescription()
    this.logger.debug(itemDescription)
    this.logger.info(`altered: end ${this.times}`)

    const equipment = this.equipmentParser.parseEquipment(itemDescription);

    this.times++;
    return equipment;
  }

  private async augmentIfNeeded(equipment: Equipment) {
    this.logger.info(`augment: start ${this.times}`)
    if (equipment.properties.length === 1) {
      this.logger.debug('item has only one property, use augmentation orb')
      await this.useAugmentationOrb()
    }

    const itemDescription = await this.readItemDescription()
    this.logger.debug(itemDescription)
    this.logger.info(`augmented: end ${this.times}`)

    return this.equipmentParser.parseEquipment(itemDescription);
  }

  private validateConditions(equipment: Equipment, conditions: AlterCondition[]) {
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
