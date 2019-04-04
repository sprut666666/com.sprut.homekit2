const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readInt32BE()', function () {
    it('Test #1', function() {
        expect((new ExtendedBuffer).writeInt32BE(100).readInt32BE()).to.equal(100);
    });

    it('Test #2', function() {
        expect((new ExtendedBuffer).writeInt32BE(-100).readInt32BE()).to.equal(-100);
    });
});
