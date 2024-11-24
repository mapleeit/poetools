export interface IElectronAPI {
  moveMouse(x: number, y: number): void;
}

declare global {
  interface Window {
    electron: IElectronAPI
  }
}
