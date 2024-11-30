import { describe, it } from 'node:test'

import { EquipmentProperty } from './EquipmentProperty'
import assert from 'node:assert'

describe('EquipmentProperty', () => {
  it('should parse properties', () => {
    const property = new EquipmentProperty('能量护盾充能时间提前 29%')

    assert.equal(property.match('能量护盾充能时间提前', [20, 30]), true)
  })
})
