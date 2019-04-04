const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readDoubleBE()', function () {
    it('Test #1', function() {
        expect((new ExtendedBuffer).writeDoubleBE(100).readDoubleBE()).to.equal(100);
    });

    it('Test #2', function() {
        expect((new ExtendedBuffer).writeDoubleBE(-100).readDoubleBE()).to.equal(-100);
    });
});
