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
      ({ row, column } = await this.inventoryPositionManager.getCurrentCursorRowColumn())
    } catch (error) {
      this.logger.info('batch save: get current cursor position failed, start from 1,1')
    }

    this.logger.info(`batch save: current cursor position ${row}, ${column}`)
    await this.batchSave(row, column)
  }

  async batchSave(startRow: number = 1, startColumn: number = 1) {
    this.logger.info('batch save: start')

    await this.keyboardAction.pressKey(Key.LeftControl)

    this.saving = true
    columnLoop:
    for (let column = startColumn; column <= this.inventoryPositionManager.maxColumns; column++) {
      for (let row = column === startColumn ? startRow : 1; row <= this.inventoryPositionManager.maxRows; row++) {
        if (this.stopSignal) {
          this.logger.info('batch save: end by stop signal')
          this.saving = false
          this.stopSignal = false
          break columnLoop
        }

        this.logger.info(` - Saving from position ${row}, ${column}`)
        const position = this.inventoryPositionManager.getPosition(row, column)

        await this.delay([20, 20])
        await this.mouseAction.setMousePosition(position)
        await this.mouseAction.click(Button.LEFT)
      }
    }
    await this.keyboardAction.releaseKey(Key.LeftControl)

    this.saving = false
    this.logger.info('batch save: end')
  }

  public stop() {
    this.stopSignal = true
  }
}
