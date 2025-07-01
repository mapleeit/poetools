import { Alter, type AlterCondition } from './Alter'
import { PositionManager as InventoryPositionManager } from '../inventory/PositionManager'

export class MultiAlter extends Alter {
  private inventoryPositionManager = new InventoryPositionManager()

  public multiAltering = false
  public stopMultiSignal = false

  public list = new Set()

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
    this.list.clear()
    try {
      await this.doMultiAlter({
        maxTimes,
        conditions,
        startColumn,
        startRow
      })

      console.log(this.list)

      if (this.list.size > 0) {
        this.notify.markdown({
          title: `multi alter success ${this.list.size}`
        })
      } else {
        // manaully cancelled
      }
    } catch (error) {
      this.logger.error(error)
      this.notify.markdown({
        title: 'multi alter failed',
        md: error instanceof Error ? error.message : String(error)
      })
    }
  }

  public async doMultiAlter({
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
        if (this.stopMultiSignal) {
          this.logger.info('multi alter: end by stop signal')
          this.stopMultiSignal = false
          this.multiAltering = false

          break columnLoop
        }

        this.logger.info(` - Altering from position ${row}, ${column}`)
        const position = this.inventoryPositionManager.getPosition(row, column)

        this.logger.info(position)
        const equipment = await this.doBatchAlter({
          maxTimes,
          conditions,
          position
        })

        if (equipment) {
          this.list.add(JSON.stringify(equipment))
        }
      }
    }

    this.multiAltering = false
  }

  public override stop() {
    this.stopMultiSignal = true
    super.stop()
  }
}
