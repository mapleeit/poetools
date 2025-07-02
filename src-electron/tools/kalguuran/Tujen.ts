import { clipboard } from 'electron';
import { Button } from 'app/shared/Button';
import { Point } from 'app/shared/Point';
import { PositionManager } from '../PositionManager';
import { Key } from 'app/shared/Key';
import { BaseTool } from '../BaseTool';

export class Tujen extends BaseTool {
  private positionManager = new PositionManager()

  private valuableCurrencies = [
    '神圣石',
    '混沌石',
    '改造石',
    '重铸石',
    '崇高石',
    '梦魇拟像裂片',
    '平行石',
    '链结石',
    '启蒙',
    '瓦尔宝珠',
    '未知的命运卡',
    '裂隙戒指',
    '富豪石',
    '制图钉',
    '宝石匠的棱镜',
    '幻色石',
    '改造石',
    '点金石',
    '裂隙碎片(夏乌拉)'
  ]

  private maxRow = 11
  private maxColumn = 2

  private last2ItemsDescription: string[] = ['', '']

  constructor() {
    super('tujen');
  }

  public async batchExchange() {
    this.logger.info('Batch exchange')
    columnLoop:
    for (let column = 1; column <= this.maxColumn; column++) {
      for (let row = 1; row <= this.maxRow; row++) {
        const result = await this.exchange(
          new Point(
            this.positionManager.positions.item1_1.x + (column - 1) * 75,
            this.positionManager.positions.item1_1.y + (row - 1) * 76
          )
        )

        if (result === false) {
          this.logger.info('Empty, break out')
          break columnLoop
        }
      }
    }
  }

  public async goNextPage() {
    this.logger.info('Go to next page')
    await this.mouseAction.setMousePosition(this.positionManager.positions.nextPage)
    await this.delay()
    await this.mouseAction.click(Button.LEFT)
    await this.delay()
  }

  public async exchange(point: Point) {
    await this.mouseAction.setMousePosition(point)
    await this.delay()

    const itemDescription = await this.readItemDescription()
    this.logger.debug(itemDescription)

    if (itemDescription === this.last2ItemsDescription[0] && itemDescription === this.last2ItemsDescription[1]) {
      return false
    }

    if (this.valuableCurrencies.some(currency => itemDescription.includes(currency))) {
      await this.mouseAction.click(Button.LEFT)
      await this.delay()

      for (let i = 0; i < 5; i++) {
        await this.mouseAction.scrollDown(10000)
      }

      await this.mouseAction.setMousePosition(this.positionManager.positions.confirm)
      await this.delay()
      await this.mouseAction.click(Button.LEFT)
      await this.delay()
    }

    this.last2ItemsDescription = [this.last2ItemsDescription[1]!, itemDescription]
  }

  private async readItemDescription() {
    clipboard.clear()
    await this.delay()
    await this.keyboardAction.click(Key.LeftControl, Key.C)
    await this.delay([100, 200])
    const itemDescription = clipboard.readText()
    await this.delay()
    return itemDescription
  }
}
