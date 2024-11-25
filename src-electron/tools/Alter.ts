import { clipboard } from 'electron'
import { createLogger, format, transports } from 'winston'

import { Button } from 'app/shared/Button'
import { Key } from 'app/shared/Key'

import { MouseAction } from './MouseAction'
import { KeyboardAction } from './KeyboardAction'
import type { Equipment } from './EquipmentParser';
import { EquipmentParser, EquipmentRarity } from './EquipmentParser'
import { PositionManager } from './PositionManager'

export class Alter {
  private mouseAction = new MouseAction()
  private keyboardAction = new KeyboardAction()
  private delayRange: [number, number] = [20, 80]

  private logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'alter' },
    format: format.json(),
    transports: [new transports.Console({
      level: 'debug'
    })]
  })

  private equipmentParser = new EquipmentParser()
  private positionManager = new PositionManager()

  private times = 0;
  private stopSignal = false;
  public altering = false

  private async delay(range: [number, number] = this.delayRange) {
    const delay = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  public async batchAlter(options: {
    maxTimes?: number,
    conditions: string[]
  }) {
    this.reset()
    const itemDescription = await this.readItemDescription()
    let equipment = this.equipmentParser.parseMagicEquipment(itemDescription)
    if (this.validateConditions(equipment, options.conditions)) {
      this.logger.info('batch alter: start success')
      this.logger.debug(equipment)
      return equipment
    }

    await this.initEquipment(equipment);

    this.altering = true

    const { maxTimes = 0, conditions } = options
    if (conditions.length === 0) {
      throw new Error('Conditions is required')
    }

    this.logger.info(`batch alter: start condition ${maxTimes === 0 ? 'Infinity' : `${maxTimes} times`}`)
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
        this.logger.info('batch alter: end success')
        this.logger.debug(conditions)
        this.logger.debug(equipment)
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

  private async useOrbOfScouring() {
    await this.mouseAction.setMousePosition(this.positionManager.orbOfScouring)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async useTransmutationOrb() {
    await this.mouseAction.setMousePosition(this.positionManager.transmutationOrb)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async useOrbOfAlteration() {
    await this.mouseAction.setMousePosition(this.positionManager.orbOfAlteration)
    await this.delay()
    await this.mouseAction.click(Button.RIGHT)
    await this.delay()
    await this.mouseAction.setMousePosition(this.positionManager.item)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  private async readItemDescription() {
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

    this.times++;
    return this.equipmentParser.parseMagicEquipment(itemDescription);
  }

  private validateConditions(equipment: Equipment, conditions: string[]) {
    switch (equipment.rarity) {
      case EquipmentRarity.MAGIC:
        return conditions
          .filter(condition => condition.trim() !== '')
          .some(condition => [...equipment.properties, ...equipment.name].some(p => p.includes(condition)))
      case EquipmentRarity.RARE:
        return false
      default:
        return false
    }
  }
}
