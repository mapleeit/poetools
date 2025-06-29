import { Alter, type AlterCondition } from './Alter'
import { PositionManager as InventoryPositionManager } from '../inventory/PositionManager'

export class MultiAlter extends Alter {
  private inventoryPositionManager = new InventoryPositionManager()

  public multiAltering = false

  public async multiAlter({
    maxTimes = 0,
    conditions,
    startColumn = 1,
    startRow = 1
  }: {
    maxTimes?: number,
    conditions: AlterCondition[]
    startColumn?: number
    startRow?: number
  }) {
    this.logger.info('multi alter: start detect environment')
    await this.detectEnvironment()

    this.multiAltering = true
    columnLoop:
    for (let column = startColumn; column <= this.inventoryPositionManager.maxColumns; column++) {
      for (let row = column === startColumn ? startRow : 1; row <= this.inventoryPositionManager.maxRows; row++) {
        if (this.stopSignal) {
          this.logger.info('multi alter: end by stop signal')
          this.stopSignal = false
          this.multiAltering = false

          break columnLoop
        }

        this.logger.info(` - Altering from position ${row}, ${column}`)
        const position = this.inventoryPositionManager.getPosition(row, column)

        this.logger.info(position)
        await this.batchAlter({
          maxTimes,
          conditions,
          position
        })
      }
    }

    this.multiAltering = false
  }
}
