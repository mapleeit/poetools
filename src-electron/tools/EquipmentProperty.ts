export class EquipmentProperty {
  private value: number

  constructor(private readonly description: string) {
    this.description = description
    this.value = parseFloat(/(\d+)/.exec(description)?.[1] ?? '0')
  }

  public match(description: string, value?: [number, number]): boolean {
    if (value) {
      return this.description.includes(description) && this.value >= value[0] && this.value <= value[1]
    }
    return this.description.includes(description)
  }
}
