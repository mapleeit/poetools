import { Button } from 'app/shared/Button';
import { BaseTool } from '../BaseTool';
import { PositionManager } from './PositionManager';
import { Key } from 'app/shared/Key';

export class Saver extends BaseTool {
  private inventoryPositionManager = new PositionManager()
  private stopSignal = false;
  public saving = false

  constructor() {
    super('saver');
  }

  async batchSaveFromCurrentCursorPosition() {
    let row = 1;
    let column = 1;

    try {
      this.logger.info('batch save: get current cursor position');
      ({ row, column } = await this.inventoryPositionManager.getCurrentCursorRowColumn())
    } catch (error) {
      this.logger.info('batch save: current cursor is not in inventory, start from 1,1')
    }

    this.logger.info(`batch save: current cursor position ${row}, ${column}`)
    await this.batchSave(row, column)
  }

  async batchSave(startRow: number = 1, startColumn: number = 1) {
    this.logger.info('batch save: start')

    this.saving = true
    await this.keyboardAction.pressKey(Key.LeftControl)

    await this.inventoryPositionManager.iterateBaseInventory(
      { startRow, startColumn },
      async ({ row, column }) => {
        if (this.stopSignal) {
          this.logger.info('batch save: end by stop signal')
          return true
        }

        this.logger.info(` - Saving from position ${row}, ${column}`)
        const position = this.inventoryPositionManager.getBaseInventoryPosition(row, column)

        await this.delay([20, 40])
        await this.mouseAction.setMousePosition(position)
        await this.mouseAction.click(Button.LEFT)
      }
    )

    await this.inventoryPositionManager.iterateExtendedInventory(
      { startRow, startColumn },
      async ({ row, column }) => {
        if (this.stopSignal) {
          this.logger.info('batch save: end by stop signal')
          return true
        }

        this.logger.info(` - Saving from position ${row}, ${column}`)
        const position = this.inventoryPositionManager.getExtendedInventoryPosition(row, column)

        await this.delay([20, 40])
        await this.mouseAction.setMousePosition(position)
        await this.mouseAction.click(Button.LEFT)
      }
    )

    await this.keyboardAction.releaseKey(Key.LeftControl)

    this.saving = false
    this.stopSignal = false
    this.logger.info('batch save: end')
  }

  public stop() {
    this.stopSignal = true
  }
}
