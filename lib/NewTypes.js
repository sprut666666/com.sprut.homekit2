import Characteristic from '../characteristic';
import {OnWrite} from '../characteristic';
import Service from '../service';

//Elgato Eve HomeKit Services & Characteristics
export function Volts(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, 'E863F10A-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "V", "Volts", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function Amperes(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, 'E863F126-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "A", "Amps", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function Watts(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, 'E863F10D-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "W", "Consumption", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function VoltAmperes(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, 'E863F110-079E-48FF-8F27-9C2605A29F52', 'uint16', false, true, true, true, false, "VA", "Apparent Power", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function KilowattHours(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, 'E863F10C-079E-48FF-8F27-9C2605A29F52', 'uint32', false, true, true, true, false, "kWh", "Total Consumption", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function KilowattVoltAmpereHour(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, 'E863F127-079E-48FF-8F27-9C2605A29F52', 'uint32', false, true, true, true, false, "kVAh", "Apparent Energy", 0, 65535, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}


// courtesy of https://github.com/robi-van-kinobi/homebridge-cubesensors
export function AtmosphericPressureLevel(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, '28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB', 'uint8', false, true, true, true, false, "mbar", "Barometric Pressure", 800, 1200, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function NoiseLevel(ID: number, value: any, onWrite?: OnWrite): Characteristic {
    const characteristic = new Characteristic(ID, '2CD7B6FD-419A-4740-8995-E3BFE43735AB', 'uint8', false, true, true, true, false, "dB", "Noise Level", 0, 200, 1, undefined, undefined, undefined);
    if (value != null && value != undefined)
        characteristic.setValue(value);
    if (onWrite)
        characteristic.onWrite = onWrite;
    return characteristic;
}

export function AtmosphericPressureSensor(ID: number, characteristics: Characteristic[], isHidden: boolean = false, isPrimary: boolean = false, linkedServices: number[] = [], checkCharacteristics: boolean = true): Service {
    const service = new Service(ID, 'B77831FD-D66A-46A4-B66D-FD7EE8DFE3CE', isHidden, isPrimary, linkedServices);

    const requiredCharacteristics = ['28FDA6BC-9C2A-4DEA-AAFD-B49DB6D155AB'];
    const optionalCharacteristics = ['00000075-0000-1000-8000-0026BB765291', '00000077-0000-1000-8000-0026BB765291', '00000079-0000-1000-8000-0026BB765291', '0000007A-0000-1000-8000-0026BB765291', '00000023-0000-1000-8000-0026BB765291'];

    if (!checkCharacteristics) {
        for (const characteristic of characteristics)
            service.addCharacteristic(characteristic);
        return service;
    }

    for (const type of requiredCharacteristics) {
        let OK = false;

        for (const characteristic of characteristics) {
            if (characteristic.getType() == type) {
                OK = true;
                break;
            }
        }

        if (!OK)
            throw new Error(type + 'is required for this service: ' + ID);
    }

    for (const characteristic of characteristics) {
        if (requiredCharacteristics.indexOf(characteristic.getType()) <= -1 && optionalCharacteristics.indexOf(characteristic.getType()) <= -1)
            throw new Error(ID + ' can not contain ' + characteristic.getType());

        service.addCharacteristic(characteristic);
    }

    return service;
}

export function NoiseLevelSensor(ID: number, characteristics: Characteristic[], isHidden: boolean = false, isPrimary: boolean = false, linkedServices: number[] = [], checkCharacteristics: boolean = true): Service {
    const service = new Service(ID, '8C85FD40-EB20-45EE-86C5-BCADC773E580', isHidden, isPrimary, linkedServices);

    const requiredCharacteristics = ['2CD7B6FD-419A-4740-8995-E3BFE43735AB'];
    const optionalCharacteristics = ['00000075-0000-1000-8000-0026BB765291', '00000077-0000-1000-8000-0026BB765291', '00000079-0000-1000-8000-0026BB765291', '0000007A-0000-1000-8000-0026BB765291', '00000023-0000-1000-8000-0026BB765291'];

    if (!checkCharacteristics) {
        for (const characteristic of characteristics)
            service.addCharacteristic(characteristic);
        return service;
    }

    for (const type of requiredCharacteristics) {
        let OK = false;

        for (const characteristic of characteristics) {
            if (characteristic.getType() == type) {
                OK = true;
                break;
            }
        }

        if (!OK)
            throw new Error(type + 'is required for this service: ' + ID);
    }

    for (const characteristic of characteristics) {
        if (requiredCharacteristics.indexOf(characteristic.getType()) <= -1 && optionalCharacteristics.indexOf(characteristic.getType()) <= -1)
            throw new Error(ID + ' can not contain ' + characteristic.getType());

        service.addCharacteristic(characteristic);
    }

    return service;
}
