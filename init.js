const {app, session, protocol, ipcMain, BrowserWindow} = require("electron")
const config = require("./magius.config")

if (config.devMode) process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"

app.whenReady().then(async () => {
  if (config.devMode) {
    await session["defaultSession"].loadExtension(__dirname + "/chrome-extensions/vue-devtools")
    await session["defaultSession"].loadExtension(__dirname + "/chrome-extensions/surfingkeys")
    protocol.registerFileProtocol("file", (request, cb) => {
      const pathname = request.url.replace("file:///", "").replace("%20", " ")
      cb(pathname)
    })
  }

  const win = new BrowserWindow({
    show: false,
    backgroundColor: "#1E1E21",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: !config.devMode,
    },
  })
  if (config.devMode)
    await win.loadURL("http://localhost:8080")
  else
    await win.loadFile("./dist/index.html")
  win.setMenuBarVisibility(false)
  win.maximize()
  win.show()

  if (config.devMode) {
    win.setMenuBarVisibility(true)
    win.webContents.openDevTools()
  }
})

ipcMain.on('ondragstart', (event, filePaths) => {
  event.sender.startDrag({
    files: filePaths,
    icon: __dirname + '/drag-icon.png'
  })
})
