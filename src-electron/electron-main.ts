import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url'
import fs from 'fs'
import 'dotenv/config'

import { type AlterCondition } from './tools/crafting/Alter'
import { Tujen } from './tools/kalguuran/Tujen'
import { Saver } from './tools/inventory/Saver'
import { MultiAlter } from './tools/crafting/MultiAlter';

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

  const multiAlter = new MultiAlter()
  const tujen = new Tujen()
  const saver = new Saver()

  let modifiers: AlterCondition[] | undefined

  // Get user data directory for saving files
  const userDataPath = app.getPath('userData')
  const saveFilePath = path.join(userDataPath, 'modifiers.json')

  // Load saved modifiers on startup
  try {
    if (fs.existsSync(saveFilePath)) {
      const savedData = fs.readFileSync(saveFilePath, 'utf8')
      modifiers = JSON.parse(savedData)
    }
  } catch (error) {
    console.error('Failed to load saved modifiers:', error)
  }

  ipcMain.handle('auto-alter', (event, data: AlterCondition[]) => {
    modifiers = data
  })

  // Save modifiers to local file
  ipcMain.handle('save-data', (event, key: string, data: AlterCondition[]) => {
    try {
      fs.writeFileSync(saveFilePath, JSON.stringify({ [key]: data }, null, 2))
      return { success: true }
    } catch (error) {
      console.error('Failed to save modifiers:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  // Load modifiers from local file
  ipcMain.handle('load-data', (event, key: string) => {
    try {
      if (fs.existsSync(saveFilePath)) {
        const savedData = fs.readFileSync(saveFilePath, 'utf8')
        const loadedData = JSON.parse(savedData)
        modifiers = loadedData[key]
        return { success: true, data: loadedData[key] }
      } else {
        return { success: false, error: 'No saved data found' }
      }
    } catch (error) {
      console.error('Failed to load modifiers:', error)
      return { success: false, error: (error as Error).message }
    }
  })

  globalShortcut.register('F2', async () => {
    if (multiAlter.multiAltering) {
      multiAlter.stop()
    } else {
      await multiAlter.multiAlter({
        conditions: modifiers ?? [],
        startColumn: 1,
        startRow: 1
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
