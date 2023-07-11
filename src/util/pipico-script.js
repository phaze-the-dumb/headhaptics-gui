const { GPIO } = require('gpio');
const { PWM } = require('pwm');
let version = '0.1.0';

let l = new PWM(2, 300, 0);
let r = new PWM(3, 300, 0);

let led = new GPIO(board.LED, OUTPUT);

l.start();
r.start();

setInterval(() => {
  led.toggle();
}, 1000);