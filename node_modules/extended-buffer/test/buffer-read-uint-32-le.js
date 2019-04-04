const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readUInt32LE()', function () {
    it('Test #1', function() {
        expect((new ExtendedBuffer).writeUInt32LE(100).readUInt32LE()).to.equal(100);
    });

    it('Test #2', function() {
        expect((new ExtendedBuffer).writeUInt32LE(200).readUInt32LE()).to.equal(200);
    });
});
