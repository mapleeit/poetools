/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.ts you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

import { contextBridge, ipcRenderer } from 'electron'
import { MouseAction } from './tools/MouseAction'
import { KeyboardAction } from './tools/KeyboardAction'
const convertToInterface = (object: object) => {
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(object))
    .filter(name => name !== 'constructor');

  return methods.reduce((acc, method) => ({
    ...acc,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [method]: (...args: unknown[]) => (object as any)[method](...args)
  }), {} as Record<string, (...args: unknown[]) => unknown>);
}

contextBridge.exposeInMainWorld('mouseApi', convertToInterface(new MouseAction()))
contextBridge.exposeInMainWorld('keyboardApi', convertToInterface(new KeyboardAction()))
contextBridge.exposeInMainWorld('ioApi', {
  send: (event: string, data: unknown) => ipcRenderer.invoke(event, data),
  saveData: (key: string, data: unknown) => ipcRenderer.invoke('save-data', key, data),
  loadData: (key: string) => ipcRenderer.invoke('load-data', key)
})
