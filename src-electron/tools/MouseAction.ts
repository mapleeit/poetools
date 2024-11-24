import type { MouseProviderInterface } from '../../shared/MouseAction.interface';
import { Button } from '../../shared/Button';
import { Point } from '../../shared/Point';

const libnut = require('bindings')('libnut')

export class MouseAction implements MouseProviderInterface {
  public static buttonLookup(btn: Button): string | undefined {
    return this.ButtonLookupMap.get(btn);
  }

  private static ButtonLookupMap: Map<Button, string> = new Map<Button, string>(
    [
      [Button.LEFT, 'left'],
      [Button.MIDDLE, 'middle'],
      [Button.RIGHT, 'right']
    ]
  );

  public setMouseDelay(delay: number): void {
    libnut.setMouseDelay(delay);
  }

  public async setMousePosition(p: Point) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.moveMouse(p.x, p.y);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async currentMousePosition() {
    return new Promise<Point>((resolve, reject) => {
      try {
        const position = libnut.getMousePos();
        resolve(new Point(position.x, position.y));
      } catch (e) {
        reject(e);
      }
    });
  }

  public async click(btn: Button) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.mouseClick(MouseAction.buttonLookup(btn));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async doubleClick(btn: Button) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.mouseClick(MouseAction.buttonLookup(btn), true);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async leftClick() {
    return this.click(Button.LEFT);
  }

  public async rightClick() {
    return this.click(Button.RIGHT);
  }

  public async middleClick() {
    return this.click(Button.MIDDLE);
  }

  public async pressButton(btn: Button) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.mouseToggle('down', MouseAction.buttonLookup(btn));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async releaseButton(btn: Button) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.mouseToggle('up', MouseAction.buttonLookup(btn));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async scrollUp(amount: number) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.scrollMouse(0, amount);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async scrollDown(amount: number) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.scrollMouse(0, -amount);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async scrollLeft(amount: number) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.scrollMouse(-amount, 0);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  public async scrollRight(amount: number) {
    return new Promise<void>((resolve, reject) => {
      try {
        libnut.scrollMouse(amount, 0);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
