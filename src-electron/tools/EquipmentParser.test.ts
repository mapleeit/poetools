import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'

import { EquipmentParser } from './EquipmentParser'

describe('EquipmentParser', () => {
  let parser: EquipmentParser

  beforeEach(() => {
    parser = new EquipmentParser()
  })

  describe('parseMagicEquipment', () => {
    it('should parse magic equipment', () => {
      const description = `物品类别: 胸甲
稀 有 度: 魔法
阳刚的精力之暮光法衣
--------
能量护盾: 298
--------
需求:
等级: 84
智慧: 293
--------
插槽: B-R
--------
物品等级: 84
--------
能量护盾充能时间提前 29%
+113 最大生命
--------
出售获得通货:非绑定`

      const result = parser.parseEquipment(description)

      assert.deepEqual(result, {
        category: '胸甲',
        rarity: '魔法',
        name: ['阳刚的精力之暮光法衣'],
        requirements: {
          level: 84,
          intelligence: 293
        },
        sockets: 'B-R',
        itemLevel: 84,
        properties: [
          '能量护盾充能时间提前 29%',
          '+113 最大生命'
        ],
        effects: []
      })
    })

    it('should parse rare equipment', () => {
      const description = `物品类别: 胸甲
稀 有 度: 稀有
狂喜 保身
圣战锁甲
--------
护甲: 239
能量护盾: 50
--------
需求:
等级: 48
力量: 64
智慧: 64
--------
插槽: R-R
--------
物品等级: 85
--------
能量护盾充能时间提前 40%
+36 最大魔力
+1 灵体数量上限`

      const result = parser.parseEquipment(description)

      assert.deepEqual(result, {
        category: '胸甲',
        rarity: '稀有',
        name: ['狂喜 保身', '圣战锁甲'],
        requirements: {
          level: 48,
          strength: 64,
          intelligence: 64
        },
        sockets: 'R-R',
        itemLevel: 85,
        properties: [
          '能量护盾充能时间提前 40%',
          '+36 最大魔力',
          '+1 灵体数量上限'
        ],
        effects: []
      })
    })

    it('should parse magic ring', () => {
      const description = `物品类别: 戒指
稀 有 度: 魔法
健壮的蝾螈之金光戒指
--------
需求:
等级: 24
--------
物品等级: 84
--------
物品稀有度提高 14% (implicit)
--------
+71 最大生命
每秒再生 2 生命
--------
圣战者物品
--------
出售获得通货:非绑定`

      const result = parser.parseEquipment(description)

      assert.deepEqual(result, {
        category: '戒指',
        rarity: '魔法',
        name: ['健壮的蝾螈之金光戒指'],
        requirements: {
          level: 24
        },
        itemLevel: 84,
        properties: [
          '物品稀有度提高 14% (implicit)',
          '+71 最大生命',
          '每秒再生 2 生命'
        ],
        effects: [
          '圣战者物品'
        ]
      })
    })
  })
})
