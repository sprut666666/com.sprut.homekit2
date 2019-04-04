const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readUInt16BE()', function () {
    it('Test #1', function() {
        expect((new ExtendedBuffer).writeUInt16BE(100).readUInt16BE()).to.equal(100);
    });

    it('Test #2', function() {
        expect((new ExtendedBuffer).writeUInt16BE(200).readUInt16BE()).to.equal(200);
    });
});
