import { Point } from 'app/shared/Point'
import { screen } from 'electron'
import { logger } from './logger';

export class PositionManager {
  public positions = {
    // ------------ Stash ------------
    item: new Point(328, 450),

    // first row
    knowledgeScroll: new Point(110, 192),

    // Second row
    transmutationOrb: new Point(58, 268),
    orbOfAlteration: new Point(110, 268),
    orbOfAnnulment: new Point(170, 268),
    orbOfChance: new Point(224, 268),

    exaltedOrb: new Point(302, 268),
    mirrorOfKalandra: new Point(358, 268),

    regalOrb: new Point(434, 268),
    orbOfAlchemy: new Point(496, 268),
    chaosOrb: new Point(550, 268),
    veiledOrb: new Point(612, 268),

    // Third row
    augmentationOrb: new Point(224, 330),
    divineOrb: new Point(612, 330),

    // Sixth row
    orbOfScouring: new Point(434, 508),

    // ------------ Tujen ------------
    item1_1: new Point(336, 288),
    item1_2: new Point(336, 338),
    item1_3: new Point(336, 388),
    item1_4: new Point(336, 438),
    item1_5: new Point(336, 488),
    item1_6: new Point(336, 538),
    item1_7: new Point(336, 588),
    item1_8: new Point(336, 638),
    item1_9: new Point(336, 688),
    item1_10: new Point(336, 738),
    item1_11: new Point(336, 788),

    confirm: new Point(628, 862),
    nextPage: new Point(950, 874)
  }

  protected logger;

  constructor() {
    this.logger = logger.child({ service: 'positionManager' });

    // Get screen resolution and adjust coordinates
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width } = primaryDisplay.size

    this.logger.debug(`screen width: ${width}px`)
    // Scale factor based on resolution (1 for 1920x1080, ~2 for 4K)
    const scaleFactor = width / 1920
    this.logger.debug(`scale factor: ${scaleFactor}`)

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
