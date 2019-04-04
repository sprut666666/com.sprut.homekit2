const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readInt32LE()', function () {
    it('Test #1', function() {
        expect((new ExtendedBuffer).writeInt32LE(100).readInt32LE()).to.equal(100);
    });

    it('Test #2', function() {
        expect((new ExtendedBuffer).writeInt32LE(-100).readInt32LE()).to.equal(-100);
    });
});
