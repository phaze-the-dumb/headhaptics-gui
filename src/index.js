const { app, BrowserWindow } = require('electron');
const fastify = require('fastify')();

if(require('electron-squirrel-startup'))
  app.quit();

let appState = 0; // 0 - Not Connected, 1 - Connected, 2 - Errored, 3 - Searching, 4 - Installing

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 355,
    height: 660,
    frame: false,
    transparent: true,
    resizable: false,
    minimizable: true,
    fullscreenable: false
  });

  // mainWindow.loadFile(path.join(__dirname, './dist/index.html')); // PRODUCTION
  mainWindow.loadURL('http://127.0.0.1:5173'); // DEVELOPMENT
  mainWindow.setMenuBarVisibility(false);

  // Open dev tools
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.openDevTools();
    mainWindow.devToolsWebContents.executeJavaScript('document.getElementsByClassName("long-click-glyph")[0].click()')
  });
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin')
    app.quit();
});

fastify.get('/api/v1/detect', ( req, reply ) => {
  reply.header('Content-Type', 'application/json');
  reply.header('Access-Control-Allow-Origin', '*');

  reply.send({ ok: true });
})

fastify.listen({ port: 46704, host: '127.0.0.1' });