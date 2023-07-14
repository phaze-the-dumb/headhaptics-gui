const { PWM } = require('pwm');
let version = '0.1.1';

let l = new PWM(2, 300, 0);
let r = new PWM(3, 300, 0);

l.start();
r.start();