/*
The reason we are using curly brackets is because we destructuring, we are pulling these two things out of electron so we can use them.
*/
const { app, BrowserWindow, Menu, globalShortcut } = require('electron')

// Setting ou environment to development.
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow

function createMainWindow(){
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: 500,
    height: 600,
    icon: './assets/icons/win/icon.ico',
    resizable: isDev ? true : false,
    backgroundColor: '#fbf6f0',
    webPreferences: {
      contextIsolation: true
    }
  })
// loadURL will load whatever url you put in there in this case we are loading a local file or you can use loadFile(./app/index.html), you can use whatever you want.
  mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}

// We have our function and we need to call it with app.on
// .on is used to call events.
app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  globalShortcut.register('CommandOrControl+R', () => mainWindow.reload())
  globalShortcut.register(isMac ? 'Command+Alt+I' : 'Control+Shift+I', () => mainWindow.toggleDevTools())

  mainWindow.on('ready', () => mainWindow = null)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu'}] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+W',
        click: () => app.quit()
      }
    ]
  }
]

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On MacOS it is common for applications and their menu bar to stay active until the user quits explicitly with cmd + Q
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})