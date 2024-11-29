import { createLogger, format, transports } from 'winston';
import { MouseAction } from './MouseAction';
import { KeyboardAction } from './KeyboardAction';

export abstract class BaseTool {
  protected mouseAction = new MouseAction();
  protected keyboardAction = new KeyboardAction();
  protected delayRange: [number, number] = [20, 80];

  protected logger;

  constructor(service: string) {
    this.logger = createLogger({
      level: 'info',
      format: format.json(),
      defaultMeta: { service },
      transports: [
        new transports.Console({
          level: 'debug',
        }),
      ],
    });
  }

  protected async delay(range: [number, number] = this.delayRange) {
    const delay = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    this.logger.debug(`Delaying ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}
