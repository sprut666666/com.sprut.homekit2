[![npm version](https://badge.fury.io/js/extended-buffer.svg)](https://badge.fury.io/js/extended-buffer)
# node-extended-buffer
Node JS extended Buffer

### Install
```bash
npm install extended-buffer --save
```

### class ExtendedBuffer
```typescript
export interface ExtendedBufferOptions {
    maxBufferLength?: number;
}

export declare class ExtendedBuffer {
    _maxBufferLength: number;
    _pointer: number;
    _pointerStart: number;
    _pointerEnd: number;
    _nativeBuffer: Buffer;
    constructor(options?: ExtendedBufferOptions);
    static readonly maxSize: number;
    static concat<T extends ExtendedBuffer>(this: new () => T, list: ExtendedBuffer[], totalLength?: number): T;
    static zigZagEncode32(value: number): number;
    static zigZagDecode32(value: number): number;
    readonly length: number;
    readonly nativeLength: number;
    readonly buffer: Buffer;
    _initEmptyBuffer(): this;
    clean(): this;
    getFreeSpaceStart(): number;
    getFreeSpaceEnd(): number;
    getFreeSpace(): number;
    allocStart(byteLength: number): this;
    allocEnd(byteLength: number): this;
    getReadableSize(): number;
    getWritableSize(): number;
    _writeNativeBuffer(buffer: Buffer, unshift?: boolean): this;
    gc(): this;
    nodeGc(): this;
    setPointer(pointer: number): this;
    getPointer(): number;
    offset(offset: number): this;
    isReadable(byteLength?: number): boolean;
    isWritable(byteLength?: number): boolean;
    toString(encoding?: string, start?: number, end?: number): string;
    writeBuffer(value: Buffer | ExtendedBuffer, unshift?: boolean): this;
    writeString(string: string, encoding?: string, unshift?: boolean): this;
    writeIntBE(value: number, byteLength: number, unshift?: boolean, noAssert?: boolean): this;
    writeIntLE(value: number, byteLength: number, unshift?: boolean, noAssert?: boolean): this;
    writeUIntBE(value: number, byteLength: number, unshift?: boolean, noAssert?: boolean): this;
    writeUIntLE(value: number, byteLength: number, unshift?: boolean, noAssert?: boolean): this;
    writeInt8(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeUInt8(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeInt16BE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeInt16LE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeUInt16BE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeUInt16LE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeInt32BE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeInt32LE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeUInt32BE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeUInt32LE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeFloatBE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeFloatLE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeDoubleBE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeDoubleLE(value: number, unshift?: boolean, noAssert?: boolean): this;
    writeVarInt32(value: number, unshift?: boolean): this;
    readBuffer(size: number, asNative?: boolean, bufferOptions?: ExtendedBufferOptions): this | Buffer;
    readString(size: number, encoding?: string): string;
    readIntBE(byteLength: number, noAssert?: boolean): number;
    readIntLE(byteLength: number, noAssert?: boolean): number;
    readUIntBE(byteLength: number, noAssert?: boolean): number;
    readUIntLE(byteLength: number, noAssert?: boolean): number;
    readInt8(noAssert?: boolean): number;
    readUInt8(noAssert?: boolean): number;
    readInt16BE(noAssert?: boolean): number;
    readInt16LE(noAssert?: boolean): number;
    readUInt16BE(noAssert?: boolean): number;
    readUInt16LE(noAssert?: boolean): number;
    readInt32BE(noAssert?: boolean): number;
    readInt32LE(noAssert?: boolean): number;
    readUInt32BE(noAssert?: boolean): number;
    readUInt32LE(noAssert?: boolean): number;
    readFloatBE(noAssert?: boolean): number;
    readFloatLE(noAssert?: boolean): number;
    readDoubleBE(noAssert?: boolean): number;
    readDoubleLE(noAssert?: boolean): number;
    readVarInt32(): number;
    isReadableVarInt32(): boolean;
}
```

### Example 1:
```js
const { ExtendedBuffer } = require('extended-buffer');
const buffer = new ExtendedBuffer;
console.log(buffer.length); // 0
buffer.writeInt32LE(123).writeInt32LE(456).writeInt32LE(789);
console.log(buffer.length); // 12

console.log(buffer.readInt32LE()); // 123
console.log(buffer.readInt32LE()); // 456
console.log(buffer.readInt32LE()); // 789
```
