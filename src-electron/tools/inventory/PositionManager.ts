import { Point } from 'app/shared/Point'
import { screen } from 'electron'

import { MouseAction } from '../MouseAction'

export class PositionManager {
  private mouseAction = new MouseAction()

  // Base coordinates for 4K (3840x2160)
  private baseInventoryFirstItem4K = new Point(2595, 1227)
  private diffX4K = 106
  private diffY4K = 106

  private get baseInventoryFirstItem() {
    const primaryDisplay = screen.getPrimaryDisplay()
    const screenWidth = primaryDisplay.size.width
    const scaleRatio = screenWidth / 3840 // Scale relative to 4K width

    return new Point(
      Math.round(this.baseInventoryFirstItem4K.x * scaleRatio),
      Math.round(this.baseInventoryFirstItem4K.y * scaleRatio)
    )
  }

  private get diffX() {
    const primaryDisplay = screen.getPrimaryDisplay()
    const screenWidth = primaryDisplay.size.width
    return Math.round(this.diffX4K * (screenWidth / 3840))
  }

  private get diffY() {
    const primaryDisplay = screen.getPrimaryDisplay()
    const screenWidth = primaryDisplay.size.width
    return Math.round(this.diffY4K * (screenWidth / 3840))
  }

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
