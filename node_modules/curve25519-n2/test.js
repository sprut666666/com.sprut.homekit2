const curve = require('bindings')('curve');

const buf1 = new Buffer.alloc(64);
const buf2 = new Buffer.alloc(64);
const buf3 = new Buffer.alloc(64);
console.log(buf1.toString('base64'));
curve.curve(buf1, buf2, buf3);
console.log(buf1.toString('base64'));
