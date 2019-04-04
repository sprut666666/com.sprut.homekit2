const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readFloatBE()', function () {
    it('Test #1', function() {
        expect((new ExtendedBuffer).writeFloatBE(100).readFloatBE()).to.equal(100);
    });

    it('Test #2', function() {
        expect((new ExtendedBuffer).writeFloatBE(-100).readFloatBE()).to.equal(-100);
    });
});
