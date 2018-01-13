'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const HAS = require('has-node');

//Elgato Eve HomeKit Services & Characteristics
function Volts(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, 'E863F10A-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "V", "Volts", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.Volts = Volts;
function Amperes(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, 'E863F126-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "A", "Amps", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.Amperes = Amperes;
function Watts(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, 'E863F10D-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "W", "Consumption", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.Watts = Watts;
function VoltAmperes(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, 'E863F110-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "VA", "Apparent Power", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.VoltAmperes = VoltAmperes;
function KilowattHours(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, 'E863F10C-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "kWh", "Total Consumption", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.KilowattHours = KilowattHours;
function KilowattVoltAmpereHour(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, 'E863F127-079E-48FF-8F27-9C2605A29F52', 'float', false, true, true, true, false, "kVAh", "Apparent Energy", 0, 65535, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.KilowattVoltAmpereHour = KilowattVoltAmpereHour;

// courtesy of https://github.com/robi-van-kinobi/homebridge-cubesensors & https://github.com/planetk/homebridge-netatmo
function AtmosphericPressureLevel(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, '28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB', 'float', false, true, true, true, false, "mbar", "Barometric Pressure", 800, 1200, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.AtmosphericPressureLevel = AtmosphericPressureLevel;
function NoiseLevel(ID, value, onWrite) {
    var characteristic = new HAS.Characteristic(ID, '2CD7B6FD-419A-4740-8995-E3BFE43735AB', 'float', false, true, true, true, false, "dB", "Noise Level", 0, 200, 0.01, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}
exports.NoiseLevel = NoiseLevel;
function AtmosphericPressureSensor(ID, characteristics, isHidden, isPrimary, linkedServices, checkCharacteristics) {
    if (isHidden === void 0) { isHidden = false; }
    if (isPrimary === void 0) { isPrimary = false; }
    if (linkedServices === void 0) { linkedServices = []; }
    if (checkCharacteristics === void 0) { checkCharacteristics = true; }
    var service = new HAS.Service(ID, 'B77831FD-D66A-46A4-B66D-FD7EE8DFE3CE', isHidden, isPrimary, linkedServices);
    var requiredCharacteristics = ['28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB'];
    var optionalCharacteristics = ['00000075-0000-1000-8000-0026BB765291', '00000077-0000-1000-8000-0026BB765291', '00000079-0000-1000-8000-0026BB765291', '0000007A-0000-1000-8000-0026BB765291', '00000023-0000-1000-8000-0026BB765291'];
    if (!checkCharacteristics) {
        for (var _i = 0, characteristics_100 = characteristics; _i < characteristics_100.length; _i++) {
            var characteristic = characteristics_100[_i];
            service.addCharacteristic(characteristic);
        }
        return service;
    }
    for (var _a = 0, requiredCharacteristics_34 = requiredCharacteristics; _a < requiredCharacteristics_34.length; _a++) {
        var type = requiredCharacteristics_34[_a];
        var OK = false;
        for (var _b = 0, characteristics_101 = characteristics; _b < characteristics_101.length; _b++) {
            var characteristic = characteristics_101[_b];
            if (characteristic.getType() == type) {
                OK = true;
                break;
            }
        }
        if (!OK)
            throw new Error(type + 'is required for this service: ' + ID);
    }
    for (var _c = 0, characteristics_102 = characteristics; _c < characteristics_102.length; _c++) {
        var characteristic = characteristics_102[_c];
        if (requiredCharacteristics.indexOf(characteristic.getType()) <= -1 && optionalCharacteristics.indexOf(characteristic.getType()) <= -1)
            throw new Error(ID + ' can not contain ' + characteristic.getType());
        service.addCharacteristic(characteristic);
    }
    return service;
}
exports.AtmosphericPressureSensor = AtmosphericPressureSensor;
function NoiseLevelSensor(ID, characteristics, isHidden, isPrimary, linkedServices, checkCharacteristics) {
    if (isHidden === void 0) { isHidden = false; }
    if (isPrimary === void 0) { isPrimary = false; }
    if (linkedServices === void 0) { linkedServices = []; }
    if (checkCharacteristics === void 0) { checkCharacteristics = true; }
    var service = new HAS.Service(ID, '8C85FD40-EB20-45EE-86C5-BCADC773E580', isHidden, isPrimary, linkedServices);
    var requiredCharacteristics = ['2CD7B6FD-419A-4740-8995-E3BFE43735AB'];
    var optionalCharacteristics = ['00000075-0000-1000-8000-0026BB765291', '00000077-0000-1000-8000-0026BB765291', '00000079-0000-1000-8000-0026BB765291', '0000007A-0000-1000-8000-0026BB765291', '00000023-0000-1000-8000-0026BB765291'];
    if (!checkCharacteristics) {
        for (var _i = 0, characteristics_100 = characteristics; _i < characteristics_100.length; _i++) {
            var characteristic = characteristics_100[_i];
            service.addCharacteristic(characteristic);
        }
        return service;
    }
    for (var _a = 0, requiredCharacteristics_34 = requiredCharacteristics; _a < requiredCharacteristics_34.length; _a++) {
        var type = requiredCharacteristics_34[_a];
        var OK = false;
        for (var _b = 0, characteristics_101 = characteristics; _b < characteristics_101.length; _b++) {
            var characteristic = characteristics_101[_b];
            if (characteristic.getType() == type) {
                OK = true;
                break;
            }
        }
        if (!OK)
            throw new Error(type + 'is required for this service: ' + ID);
    }
    for (var _c = 0, characteristics_102 = characteristics; _c < characteristics_102.length; _c++) {
        var characteristic = characteristics_102[_c];
        if (requiredCharacteristics.indexOf(characteristic.getType()) <= -1 && optionalCharacteristics.indexOf(characteristic.getType()) <= -1)
            throw new Error(ID + ' can not contain ' + characteristic.getType());
        service.addCharacteristic(characteristic);
    }
    return service;
}
exports.NoiseLevelSensor = NoiseLevelSensor;
