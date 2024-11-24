export class Point {
  constructor(public x: number, public y: number) {
    this.x = x
    this.y = y
  }

  public toString() {
    return `(${this.x}, ${this.y})`;
  }
}
