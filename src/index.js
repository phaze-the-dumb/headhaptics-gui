const { app, BrowserWindow, shell } = require('electron');
const fastify = require('fastify')();
const { SerialPort } = require('serialport');
const ymodem = require('./util/ymodem');
const fs = require('fs');
const path = require('path');
const osc = require('node-osc');

if(require('electron-squirrel-startup'))
  app.quit();

let appState = 0; // 0 - Not Connected, 1 - Connected, 2 - Errored, 3 - Searching, 4 - Installing
let port = null;
let lastSerialLength = 0;
let expectedVersion = '0.1.1';
let mainWindow;
let hapticStrength = 0.75;

let oscServer = new osc.Server(9001, '0.0.0.0');

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 365,
    height: 230,
    frame: false,
    transparent: true,
    resizable: false,
    minimizable: true,
    fullscreenable: false
  });

  mainWindow.loadFile(path.join(__dirname, './dist/index.html')); // PRODUCTION
  // mainWindow.loadURL('http://127.0.0.1:5173'); // DEVELOPMENT
  mainWindow.setMenuBarVisibility(false);
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin')
    app.quit();
});

fastify.get('/api/v1/state', ( req, reply ) => {
  reply.header('Content-Type', 'application/json');
  reply.header('Access-Control-Allow-Origin', '*');

  reply.send({ ok: true, state: appState });
})

fastify.get('/api/v1/opendownloads', ( req, reply ) => {
  reply.header('Content-Type', 'application/json');
  reply.header('Access-Control-Allow-Origin', '*');

  shell.openExternal('https://kalumajs.org/download/');
  reply.send({ ok: true });
})

fastify.get('/api/v1/minimise', ( req, reply ) => {
  reply.header('Content-Type', 'application/json');
  reply.header('Access-Control-Allow-Origin', '*');

  mainWindow.minimize();
  reply.send({ ok: true });
})

fastify.listen({ port: 46704, host: '127.0.0.1' });

let startDetectionThread = async ( ports ) => {
  // https://github.com/kaluma-project/kaluma-cli/blob/master/bin/kaluma.js#L73 - Very helpful.
  if(!ports)
    ports = await SerialPort.list();

  ports.forEach(p => {
    if(p.vendorId)
      p.vendorId = p.vendorId.toLowerCase();

    if(p.productId)
      p.productId = p.productId.toLowerCase();
  })

  let vid = '2e8a';
  let result = ports.find(p => p.vendorId === vid);

  if(!result)
    return appState = 0;

  appState = 4;

  port = new SerialPort({ path: result.path, baudRate: 9600 });
  port.write('\r.echo off\r');

  let data = '';

  let scriptInstalled = false;

  let timeout = setTimeout(() => {
    if(!scriptInstalled){
      const picoscript = fs.readFileSync(path.join(__dirname, './util/pipico-script.js'));
      port.removeAllListeners();
      console.log('Reinstalling Pico Script.');

      port.write("\r");
      port.write(".flash -w\r");

      setTimeout(() => {
        ymodem.transfer(port, 'usercode', picoscript, ( err, result ) => {
          if(err){
            console.error(err);
            appState = 2;
          } else{
            startMainThread();
            appState = 1;
          }
        });
      }, 500);
    }
  }, 5000);

  port.on('data', ( chunk ) => {
    data += chunk.toString();

    if(data.split(expectedVersion).length > 1 && !scriptInstalled) {
      scriptInstalled = true;
      appState = 1;
      port.removeAllListeners();

      clearTimeout(timeout);
      startMainThread();
    }
  })

  port.write('version\r');
}

let startMainThread = async () => { 
  port.on('close', () => {
    appState = 0;
    lastSerialLength--;
  })

  port.on('error', ( e ) => {
    appState = 2;
    lastSerialLength--;
    console.error(e);
  })

  let resetTimeout = setTimeout(() => {
    port.write('l.setDuty(0)\r');
  }, 1000);

  oscServer.on('message', msg => {
    if(msg[0] === '/avatar/parameters/HapticsMultiplier')
      hapticStrength = msg[1];

    if(msg[0] === '/avatar/parameters/LContact'){
      port.write('l.setDuty('+(msg[1] * hapticStrength).toString()+')\r');
      clearTimeout(resetTimeout);

      resetTimeout = setTimeout(() => {
        port.write('l.setDuty(0)\r');
      }, 1000);
    }

    if(msg[0] === '/avatar/parameters/RContact'){
      port.write('r.setDuty('+(msg[1] * hapticStrength).toString()+')\r');
      clearTimeout(resetTimeout);

      resetTimeout = setTimeout(() => {
        port.write('l.setDuty(0)\r');
      }, 1000);
    }
  })
}

let updateCheckingThread = async () => {
  if(appState === 2 || appState === 0){
    let ports = await SerialPort.list();

    if(ports.length > lastSerialLength){
      startDetectionThread(ports);
      lastSerialLength = ports.length;
    }
  }

  setTimeout(() => updateCheckingThread(), 1000);
}

updateCheckingThread();