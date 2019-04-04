const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.getReadableSize()', function () {
    it('Test #1', function() {
        let buffer = new ExtendedBuffer;
        expect(buffer.getReadableSize()).to.equal(0);
    });

    it('Test #2', function() {
        let buffer = (new ExtendedBuffer).writeUInt32BE();
        expect(buffer.getReadableSize()).to.equal(4);
    });

    it('Test #3', function() {
        let buffer = (new ExtendedBuffer).writeUInt32BE();
        buffer.readUInt8();
        expect(buffer.getReadableSize()).to.equal(3);
    });
});
