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
  effects: string[];
}

export enum EquipmentRarity {
  MAGIC = '魔法',
  RARE = '稀有',
  NORMAL = '普通'
}

export enum EquipmentEffectType {
  CRUSADER = '圣战者物品',
  SHAPER = '塑界者物品',
  EMBLEM = '灭界者物品',
  FORGE = '焚界者物品'
}

export const UNDEFINED_EQUIPMENT_DESCRIPTION = '未鉴定'
export const CURRENCY_DESCRIPTION = '出售获得通货'

export class EquipmentParser {
  private logger = createLogger({
    level: 'info',
    defaultMeta: { service: 'equipment-parser' },
    format: format.json(),
    transports: [new transports.Console({
      level: 'debug'
    })]
  })

  private SEPARATOR_REGEXP = /^-{4,}$/

  public parseEquipment(description: string): Equipment {
    let lines = description.split(/\r\n|\n/)
    const equipment = {} as Equipment
    let currentSection = ''

    equipment.effects = this.parseEffect(lines)
    for (const effect of equipment.effects) {
      lines = lines.map(line => line.replace(effect, ''))
    }

    for (let i = 1; i < lines.length; i++) {
      const lastLine = lines[lines.length - 1]
      if (
        lastLine?.trim() === '' ||
        this.SEPARATOR_REGEXP.test(lastLine?.trim() ?? '') ||
        lastLine?.trim().startsWith(CURRENCY_DESCRIPTION)
      ) {
        lines.pop()
      } else {
        break
      }
    }

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine === '') continue
      if (this.SEPARATOR_REGEXP.test(trimmedLine)) {
        if (currentSection === 'itemLevel') {
          currentSection = 'properties'
          equipment.properties = []
          continue
        }

        if (currentSection === 'properties') {
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
        if (this.SEPARATOR_REGEXP.test(trimmedLine)) {
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

      if (trimmedLine.startsWith('插槽:')) {
        equipment.sockets = trimmedLine.split(':')[1]?.trim() ?? ''
        continue
      }

      // Parse properties after itemLevel and its following ----
      if (currentSection === 'properties') {
        equipment.properties.push(trimmedLine)
        continue
      }
    }

    this.logger.debug(equipment)
    return equipment
  }

  private parseEffect(lines: string[]): string[] {
    const effects: string[] = []
    for (const effect of Object.values(EquipmentEffectType)) {
      if (lines.some(line => line.includes(effect))) {
        effects.push(effect)
      }
    }

    return effects
  }
}
