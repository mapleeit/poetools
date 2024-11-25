import { createLogger, format, transports } from 'winston';

export interface Equipment {
  name: string[];
  category: string;
  rarity: string;
  base: {
    armor?: number;
    energyShield?: number;
    dodge?: number;
  },
  requirements: {
    level: number;
    intelligence?: number;
    strength?: number;
    dexterity?: number;
  };
  sockets: string;
  itemLevel: number;
  properties: string[];
}

export enum EquipmentRarity {
  MAGIC = '魔法',
  RARE = '稀有',
  NORMAL = '普通'
}

export class EquipmentParser {
  private logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'equipment-parser' },
    format: format.json(),
    transports: [new transports.Console()]
  })

  public parseMagicEquipment(description: string): Equipment {
    const lines = description.split('\n')
    const equipment = {} as Equipment
    let currentSection = ''

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine === '') continue
      if (/^-{4,}$/.test(trimmedLine)) {
        if (currentSection === 'itemLevel') {
          currentSection = 'properties'
          equipment.properties = []
          continue
        }
        currentSection = ''
        continue
      }

      // Parse basic properties
      if (trimmedLine.startsWith('物品类别:')) {
        equipment.category = trimmedLine.split(':')[1]?.trim() ?? ''
        continue
      }
      if (trimmedLine.startsWith('稀 有 度:')) {
        equipment.rarity = trimmedLine.split(':')[1]?.trim() ?? ''
        currentSection = 'name'
        equipment.name = []
        continue
      }
      if (trimmedLine.startsWith('物品等级:')) {
        equipment.itemLevel = parseInt(trimmedLine.split(':')[1]?.trim() ?? '')
        currentSection = 'itemLevel'
        continue
      }

      // Parse name
      if (currentSection === 'name') {
        if (/^-{4,}$/.test(trimmedLine)) {
          currentSection = ''
          continue
        }
        equipment.name.push(trimmedLine)
        continue
      }

      // Parse requirements
      if (trimmedLine === '需求:') {
        currentSection = 'requirements'
        equipment.requirements = {} as Equipment['requirements']
        continue
      }
      if (currentSection === 'requirements') {
        if (trimmedLine.startsWith('等级:')) {
          equipment.requirements.level = parseInt(trimmedLine.split(':')[1]?.trim() ?? '')
        } else if (trimmedLine.startsWith('力量:')) {
          equipment.requirements.strength = parseInt(trimmedLine.split(':')[1]?.trim() ?? '')
        } else if (trimmedLine.startsWith('敏捷:')) {
          equipment.requirements.dexterity = parseInt(trimmedLine.split(':')[1]?.trim() ?? '')
        } else if (trimmedLine.startsWith('智慧:')) {
          equipment.requirements.intelligence = parseInt(trimmedLine.split(':')[1]?.trim() ?? '')
        }
        continue
      }

      // Parse properties after itemLevel and its following ----
      if (currentSection === 'properties') {
        if (/^-{4,}$/.test(trimmedLine)) {
          currentSection = ''
          continue
        }
        equipment.properties.push(trimmedLine)
        continue
      }
    }

    return equipment
  }
}
