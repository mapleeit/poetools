import { Point } from 'app/shared/Point'

import { MouseAction } from '../MouseAction'

export class PositionManager {
  private mouseAction = new MouseAction()

  private baseInventoryFirstItem = new Point(2595, 1227)

  private diffX = 106
  private diffY = 106
  public maxRows = 5
  public maxColumns = 12

  public getPosition(row: number, column: number) {
    if (row > this.maxRows || column > this.maxColumns) {
      throw new Error('Invalid row or column')
    }

    return new Point(
      this.baseInventoryFirstItem.x + (column - 1) * this.diffX,
      this.baseInventoryFirstItem.y + (row - 1) * this.diffY
    )
  }

  public async getCurrentCursorRowColumn() {
    const currentCursorPosition = await this.mouseAction.currentMousePosition()

    const baseInventoryLeftTop = new Point(
      this.baseInventoryFirstItem.x - (this.diffX / 2),
      this.baseInventoryFirstItem.y - (this.diffY / 2)
    )

    const baseInventoryRightBottom = new Point(
      baseInventoryLeftTop.x + (this.maxColumns * this.diffX),
      baseInventoryLeftTop.y + (this.maxRows * this.diffY)
    )

    if (currentCursorPosition.x < baseInventoryLeftTop.x || currentCursorPosition.x > baseInventoryRightBottom.x ||
      currentCursorPosition.y < baseInventoryLeftTop.y || currentCursorPosition.y > baseInventoryRightBottom.y) {
      throw new Error('Current cursor position is out of inventory area')
    }

    const relativeX = currentCursorPosition.x - baseInventoryLeftTop.x
    const relativeY = currentCursorPosition.y - baseInventoryLeftTop.y

    const column = Math.floor(relativeX / this.diffX) + 1
    const row = Math.floor(relativeY / this.diffY) + 1

    return { row, column }
  }
}
