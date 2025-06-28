import { Point } from 'app/shared/Point'

export class PositionManager {
  public positions = {
    // ------------ Stash ------------
    item: new Point(164, 225),

    // first row
    knowledgeScroll: new Point(55, 96),

    // Second row
    transmutationOrb: new Point(29, 134),
    orbOfAlteration: new Point(55, 134),
    orbOfAnnulment: new Point(85, 134),
    orbOfChance: new Point(112, 134),

    exaltedOrb: new Point(151, 134),
    mirrorOfKalandra: new Point(179, 134),

    regalOrb: new Point(217, 134),
    orbOfAlchemy: new Point(248, 134),
    chaosOrb: new Point(275, 134),
    veiledOrb: new Point(306, 134),

    // Third row
    augmentationOrb: new Point(112, 165),
    divineOrb: new Point(306, 165),

    // Sixth row
    orbOfScouring: new Point(217, 254),

    // ------------ Tujen ------------
    item1_1: new Point(168, 144),
    item1_2: new Point(168, 169),
    item1_3: new Point(168, 194),
    item1_4: new Point(168, 219),
    item1_5: new Point(168, 244),
    item1_6: new Point(168, 269),
    item1_7: new Point(168, 294),
    item1_8: new Point(168, 319),
    item1_9: new Point(168, 344),
    item1_10: new Point(168, 369),
    item1_11: new Point(168, 394),

    confirm: new Point(314, 431),
    nextPage: new Point(475, 437)
  }

  constructor() {
    // Get screen resolution and adjust coordinates
    const { screen } = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width } = primaryDisplay.size

    // Scale factor based on resolution (1 for 1920x1080, ~2 for 4K)
    const scaleFactor = width / 1920

    // Adjust all coordinates based on scale factor
    Object.entries(this.positions).forEach(([key, value]) => {
      if (value instanceof Point) {
        (this.positions as Record<string, Point>)[key] = new Point(
          Math.round(value.x * scaleFactor),
          Math.round(value.y * scaleFactor)
        )
      }
    })
  }
}
