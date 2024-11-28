import { beforeEach, describe, it } from 'node:test'
import { deepEqual } from 'node:assert'
import { Point } from 'app/shared/Point'
import { PositionManager } from './PositionManager'

describe('PositionManager', () => {
  let positionManager: PositionManager

  beforeEach(() => {
    positionManager = new PositionManager()
  })

  describe('getPosition', () => {
    it('should return correct position for first item (1,1)', () => {
      const position = positionManager.getPosition(1, 1)
      deepEqual(position, new Point(2595, 1227))
    })

    it('should return correct position for item at (2,1)', () => {
      const position = positionManager.getPosition(2, 1)
      deepEqual(position, new Point(2595, 1333))
    })

    it('should return correct position for item at (1,2)', () => {
      const position = positionManager.getPosition(1, 2)
      deepEqual(position, new Point(2701, 1227))
    })

    it('should return correct position for item at (2,2)', () => {
      const position = positionManager.getPosition(2, 2)
      deepEqual(position, new Point(2701, 1333))
    })
  })
})
