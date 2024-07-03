const { app, BrowserWindow, ipcMain, dialog, nativeImage, Tray } = require('electron');

const path = require('node:path');
const dispatchEmail = require('./src/action/dispatchEmail');

const createWindow = () => {
      const trayIcon = nativeImage.createFromPath('./src/image/icon.ico');
      const appIcon = nativeImage.createFromPath('./src/image/icon.ico');
      const tray = new Tray(trayIcon)
      const win = new BrowserWindow({
            width: 800,
            height: 600,
            icon: appIcon,
            resizable: false,
            autoHideMenuBar: true,
            webPreferences: {
                  preload: path.join(__dirname, 'preload.js'),
                  autofill: true
            },
      })

      win.loadFile('./src/pages/home/index.html')


}

function dialogTest() {
      console.log({ teste: "Estou aqui" })
      return "é isso meu chapa"
}

ipcMain.handle('teste2', async () => {
      return { message: "uai" }
})

app.whenReady().then(() => {
      ipcMain.on('set-dialog', dialogTest)
      createWindow();
      app.on('activete', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
      })



})

app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
})

ipcMain.on("dispatch-email", async (event, args) => {

      let result = { errorMessage: "" };
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@a-zA-Z0-9?(?:\.a-zA-Z0-9?)*$/;

      if (!regex.test(args?.emailOrigem)) {
            result.errorMessage = "Email de origem não é valido";
      }
      else if (!regex.test(args?.usuario)) {
            result.errorMessage = "Email de  acesso está invalido";
      }
      else if (!regex.test(args?.destinatario)) {
            result.errorMessage = "Email do destinatario está invalido";
      }

      if (result?.errorMessage?.length <= 0) {
            result = await dispatchEmail(args);
      }

      event.sender.send("dispatch-email-response", result);
})