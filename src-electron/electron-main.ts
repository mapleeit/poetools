import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url'
import 'dotenv/config'

import { Alter, type AlterCondition } from './tools/crafting/Alter'
import { Tujen } from './tools/kalguuran/Tujen'
import { Saver } from './tools/inventory/Saver'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow: BrowserWindow | undefined;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1200,
    height: 600,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      ),
      sandbox: false
    },
  });

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL);
  } else {
    mainWindow.loadFile('index.html');
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

(async () => {
  await app.whenReady();

  const alter = new Alter()
  const tujen = new Tujen()
  const saver = new Saver()

  let modifiers: AlterCondition[] | undefined

  await ipcMain.handle('auto-alter', (event, data: AlterCondition[]) => {
    modifiers = data
  })

  globalShortcut.register('F2', async () => {
    if (alter.altering) {
      alter.stop()
    } else {
      await alter.batchAlter({
        conditions: modifiers ?? []
      })
    }
  });

  globalShortcut.register('F3', async () => {
    await tujen.batchExchange()
  });

  globalShortcut.register('F4', async () => {
    await tujen.goNextPage()
  });

  globalShortcut.register('F6', async () => {
    if (saver.saving) {
      saver.stop()
    } else {
      await saver.batchSaveFromCurrentCursorPosition()
    }
  });

  globalShortcut.register('CommandOrControl+F6', async () => {
    if (saver.saving) {
      saver.stop()
    } else {
      await saver.batchSaveFromCurrentCursorPosition()
    }
  });

  await createWindow();
})()

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});
