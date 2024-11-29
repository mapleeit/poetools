import { createLogger, format, transports } from 'winston';

import { PositionManager } from './PositionManager';
import { KeyboardAction } from '../KeyboardAction';
import { MouseAction } from '../MouseAction';
import { Key } from 'app/shared/Key';
import { Button } from 'app/shared/Button';

export class Saver {
  private inventoryPositionManager = new PositionManager()
  private mouseAction = new MouseAction()
  private keyboardAction = new KeyboardAction()

  private stopSignal = false;
  public saving = false

  private delayRange: [number, number] = [20, 80]

  private logger = createLogger({
    level: 'info',
    format: format.json(),
    defaultMeta: { service: 'saver' },
    transports: [new transports.Console({
      level: 'debug'
    })]
  })

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

  private async delay(range: [number, number] = this.delayRange) {
    const delay = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]
    this.logger.debug(`Delaying ${delay}ms`)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}
