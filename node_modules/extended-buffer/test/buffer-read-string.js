const expect  = require('chai').expect;
const ExtendedBuffer = require('../index');

describe('buffer.readString()', function () {
    it('Test #1', function() {
        let buffer = (new ExtendedBuffer).writeBuffer(Buffer.from('abcde'));
        expect(buffer.readString(3)).to.equal('abc');
    });

    it('Test #2', function() {
        let buffer = (new ExtendedBuffer).writeBuffer(Buffer.from('abcde')).offset(3);
        expect(buffer.readString(2)).to.equal('de');
    });
});
