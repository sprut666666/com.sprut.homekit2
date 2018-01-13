"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var characteristic_1 = require("../characteristic");
var service_1 = require("../service");

function Watts(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F10D-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "W", "Consumption", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

function KilowattHours(ID, value, onWrite) {
    var characteristic = new characteristic_1.default(ID, 'E863F10C-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "kWh", "Total Consumption", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
