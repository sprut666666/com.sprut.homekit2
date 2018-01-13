"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var characteristic_1 = require("../characteristic");
var service_1 = require("../service");

function Volts(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F10A-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "V", "Volts", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

function Amperes(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F126-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "A", "Amps", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

function Watts(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F10D-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "W", "Consumption", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

function VoltAmperes(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F110-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "VA", "Apparent Power", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

function KilowattHours(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F10C-079E-48FF-8F27-9C2605A29F52', 'uint32', false, true, true, true, false, "kWh", "Total Consumption", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

function KilowattVoltAmpereHour(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F127-079E-48FF-8F27-9C2605A29F52', 'uint32', false, true, true, true, false, "kVAh", "Apparent Energy", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
