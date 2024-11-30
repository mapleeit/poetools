import { MouseAction } from './MouseAction';
import { KeyboardAction } from './KeyboardAction';
import { logger } from './logger';

export abstract class BaseTool {
  protected mouseAction = new MouseAction();
  protected keyboardAction = new KeyboardAction();
  protected delayRange: [number, number] = [20, 80];

  protected logger;

  constructor(service: string) {
    this.logger = logger.child({ service });
  }

  protected async delay(range: [number, number] = this.delayRange) {
    const delay = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    this.logger.debug(`Delaying ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
