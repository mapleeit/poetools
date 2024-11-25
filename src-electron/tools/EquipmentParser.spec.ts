// import { EquipmentParser } from './EquipmentParser'

// describe('EquipmentParser', () => {
//   let parser: EquipmentParser

//   beforeEach(() => {
//     parser = new EquipmentParser()
//   })

//   describe('parseMagicEquipment', () => {
//     it('should parse equipment with energy shield', () => {
//       const description = `物品类别: 胸甲
// 稀 有 度: 魔法
// 阳刚的精力之暮光法衣
// --------
// 能量护盾: 298
// --------
// 需求:
// 等级: 84
// 智慧: 293
// --------
// 插槽: B-R
// --------
// 物品等级: 84
// --------
// 能量护盾充能时间提前 29%
// +113 最大生命
// --------
// 出售获得通货:非绑定`

//       const result = parser.parseMagicEquipment(description)

//       expect(result).toEqual({
//         category: '胸甲',
//         rarity: '魔法',
//         name: ['阳刚的精力之暮光法衣'],
//         requirements: {
//           level: 84,
//           intelligence: 293
//         },
//         sockets: 'B-R',
//         itemLevel: 84,
//         properties: [
//           '能量护盾充能时间提前 29%',
//           '+113 最大生命'
//         ]
//       })
//     })

//     it('should parse equipment with armor and energy shield', () => {
//       const description = `物品类别: 胸甲
// 稀 有 度: 稀有
// 狂喜 保身
// 圣战锁甲
// --------
// 护甲: 239
// 能量护盾: 50
// --------
// 需求:
// 等级: 48
// 力量: 64
// 智慧: 64
// --------
// 插槽: R-R
// --------
// 物品等级: 85
// --------
// 能量护盾充能时间提前 40%
// +36 最大魔力
// +1 灵体数量上限`

//       const result = parser.parseMagicEquipment(description)

//       expect(result).toEqual({
//         category: '胸甲',
//         rarity: '稀有',
//         name: ['狂喜 保身', '圣战锁甲'],
//         requirements: {
//           level: 48,
//           strength: 64,
//           intelligence: 64
//         },
//         sockets: 'R-R',
//         itemLevel: 85,
//         properties: [
//           '能量护盾充能时间提前 40%',
//           '+36 最大魔力',
//           '+1 灵体数量上限'
//         ]
//       })
//     })

//     it('should parse equipment with evasion and energy shield', () => {
//       const description = `物品类别: 胸甲
// 稀 有 度: 稀有
// 忧伤 守卫者
// 防水外衣
// --------
// 闪避值: 127
// 能量护盾: 29
// --------
// 需求:
// 等级: 62
// 敏捷: 35
// 智慧: 35
// --------
// 插槽: G-B-R-G
// --------
// 物品等级: 80
// --------
// +6 最大生命
// 每秒再生 116.5 生命
// +29% 闪电抗性
// +1 灵体数量上限`

//       const result = parser.parseMagicEquipment(description)

//       expect(result).toEqual({
//         category: '胸甲',
//         rarity: '稀有',
//         name: ['忧伤 守卫者', '防水外衣'],
//         requirements: {
//           level: 62,
//           dexterity: 35,
//           intelligence: 35
//         },
//         sockets: 'G-B-R-G',
//         itemLevel: 80,
//         properties: [
//           '+6 最大生命',
//           '每秒再生 116.5 生命',
//           '+29% 闪电抗性',
//           '+1 灵体数量上限'
//         ]
//       })
//     })
//   })
// })
