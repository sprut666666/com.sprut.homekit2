'use strict'
const HAS = require('has-node');
const NewTypes = require('new-types-for-homekit/has.js');
const debug = true;
const test = false;

function map(inputStart, inputEnd, outputStart, outputEnd, input)
{
  return outputStart + ((outputEnd - outputStart) / (inputEnd - inputStart)) * (input - inputStart);
}

function state2num(state)
{
  if (state) {
    return 1;
  }
  else {
    return 0;
  }
}

function num2state(num)
{
  if (num == 1) {
    return true;
  }
  else {
    return false;
  }
}

function stateCover2num(state,opposite)
{
  if (state=='up')
  {
    return (opposite?0:1)
  }
  else if(state=='down')
  {
    return (opposite?1:0)
  }else
  {
    return 2;
  }
}
function stateCover2proc(state,opposite)
{
  if (state=='down')
  {
    return (opposite?100:0)
  }
  else if(state=='up')
  {
    return (opposite?0:100)
  }else
  {
    return 50;
  }
}
function aqi2AirQualityMainlandChina(state)
{
  if (state <= 50)
  {
    return 1;//EXCELLENT
  }
  else if(state <= 100)
  {
    return 2;//GOOD
  }
  else if(state <= 200)
  {
    return 3;//FAIR
  }
  else if(state <= 300)
  {
    return 4;//INFERIOR
  }
  else
  {
    return 5;//POOR
  }
}
function p252AirQuality(state)
{
  if (state <= 50)
  {
    return 1;//EXCELLENT
  }
  else if(state <= 75)
  {
    return 2;//GOOD
  }
  else if(state <= 100)
  {
    return 3;//FAIR
  }
  else if(state <= 150)
  {
    return 4;//INFERIOR
  }
  else
  {
    return 5;//POOR
  }
}
function co2AirQuality(state)
{
  if (state <= 900)
  {
    return 1;//EXCELLENT
  }
  else if(state <= 1150)
  {
    return 2;//GOOD
  }
  else if(state <= 1400)
  {
    return 3;//FAIR
  }
  else if(state <= 1600)
  {
    return 4;//INFERIOR
  }
  else
  {
    return 5;//POOR
  }
}
function co2CarbonDioxideDetected(state)
{
  if (state > 1600)
  {
    return 1;//CO2_LEVELS_ABNORMAL
  }
  else
  {
    return 0;//CO2_LEVELS_NORMAL
  }
}
function targetTemperature2correct(state)
{
  if (state < 10)
  {
    return 10;
  }
  else if(state>38)
  {
    return 38;
  }else
  {
    return state;
  }
}
function targeTemperature2thermostatMode(state)
{
  if (state == 25)
  {
    return 1;
  }
  else if(state==20)
  {
    return 2;
  }else
  {
    return 3;
  }
}
function targeTemperature2currentThermostatMode(state)
{
  if (state == 25)
  {
    return 1;
  }
  else if(state==20)
  {
    return 2;
  }else
  {
    return 0;
  }
}


function thermostatMode2targetHeatingCoolingState(value)
{
  if (value == 'heat')
  {
    return 1;//heat
  }
  else if (value == 'cool')
  {
    return 2;//cool
  }
  else if (value == 'auto')
  {
    return 3;//auto
  }
  else
  {
    return 0;
  }
}

function thermostatMode2currentHeatingCoolingState(value)
{
  if (value == 'heat')
  {
    return 1;//heat
  }
  else if (value == 'cool')
  {
    return 2;//cool
  }
  else if (value == 'auto')
  {
    return 2;//cool
  }
  else
  {
    return 0;
  }
}

function eurotronicMode2targetHeatingCoolingState(value)
{
  if (value == 'MANUFACTURER SPECIFC')
  {
    return 1;//heat
  }
  else if (value == 'Energy Save Heat')
  {
    return 2;//cool
  }
  else if (value == 'Heat')
  {
    return 3;//auto
  }
  else
  {
    return 0;
  }
}

function eurotronicMode2currentHeatingCoolingState(value)
{
  if (value == 'MANUFACTURER SPECIFC')
  {
    return 1;//heat
  }
  else if (value == 'Energy Save Heat')
  {
    return 2;//cool
  }
  else if (value == 'Heat')
  {
    return 2;//cool
  }
  else
  {
    return 0;
  }
}

function vacuumcleaner2state(state)
{
  if (state == 'cleaning')
  {
    return true;//heat
  }
  else
  {
    return false;
  }
}


function alarmBattery(state)
{
  if (state <= 10 )
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

function homealarm_state2SecuritySystemTargetState(state)
{
  if (state == 'armed')
  {
    return 1;
  }
  else if (state == 'disarmed')
  {
    return 3;
  }
  else if (state == 'partially_armed')
  {
    return 0;
  }
  else
  {
    return 2;
  }
}


function setOffForButton(onButton)
{
  try {
    onButton.setValue(false);
  } catch(error) {

  }
}

async function updateStatus(device,variable,status,callback)
{
  if (device.available)
  {
    if (device.capabilitiesObj[status].value != variable && variable != null && variable != undefined)
    {
      if (debug) console.log(device.name + ': set ' + status + " = " + device.capabilitiesObj[status].value + " => " + variable, 'info');

      if (('zw_wakeup_interval' in device.settings) && (device.settings.zw_wakeup_interval > 15))
      {
        if (debug) console.log(device.name + ': zw_wakeup_interval = ' + device.settings.zw_wakeup_interval, 'info');
        try
        {
          device.setCapabilityValue(status, variable);
        } catch(error)
        {
          console.log(device.name + ': ' + error, 'error');
        }
        callback(HAS.statusCodes.OK);
      }else
      {
        try
        {
          await device.setCapabilityValue(status, variable);
          callback(HAS.statusCodes.OK);
        } catch(error)
        {
          console.log(device.name + ': ' + error, 'error');
          //use another status code based on error and then callback it
          if (error == 'Error: senddata_timeout')
          {
            callback(HAS.statusCodes.timedout);
          }else if (error == 'Error: TRANSMIT_COMPLETE_NO_ACK' || error == 'Error: Timed out after 5000ms.' )
          {
            callback(HAS.statusCodes.OK);
          }else
          {
            callback(HAS.statusCodes.busy);
          }
        }
      }
    }else
    {
      callback(HAS.statusCodes.OK);
    }

  }else
  {
    if (debug) console.log(device.name + ': not available ', 'error');
    callback(HAS.statusCodes.busy);
  }
}

function testStab(deviceHK, status, device)
{

  setTimeout(updateStatusOnHKNoNull, 10000, true, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, false, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, "sos", deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, 'sos', deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, -1, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, null, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, NaN, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, undefined, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, -99999999, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, 99999999, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, 0, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, null*10, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, NaN*10, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, undefined*10, deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, '-10', deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, '0', deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, '0.12032', deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, '-0.12032', deviceHK, status, device);
  setTimeout(updateStatusOnHKNoNull, 10000, '12032', deviceHK, status, device);

}

function updateStatusOnHKNoNull(variable, deviceHK, status, device)
{
  //testStab(deviceHK, status, device);
  if (deviceHK.getValue() != variable)
  {
    if (debug) console.log('Update: '+ device.name + ' ' + status + ': ' + deviceHK.getValue() + ' new: ' + variable, "info");

    try {
      deviceHK.setValue(variable);
    } catch(error) {
      console.log(device.name + ': set value ' + error, 'error');
    }

  }
}

function sDV(value, defaultValue) //setDefaultValue
{
  return (value === null || value === undefined)?defaultValue:value;
}

function reverseStr(str)
{
  return str.split("").reverse().join("");
}

function configServer(homey)
{
  let server = {};

  if (debug) console.log(JSON.stringify(homey), 'success');


  // Config for server
  let config = new HAS.Config(homey.hostname + ' ' + homey.cloudId, reverseStr(homey.wifiMac), HAS.categories.bridge, '../userdata/homey.json', 8091, '666-66-666');
  //let config = new HAS.Config(homey.hostname, homey.wifi_mac, HAS.categories.bridge, '../userdata/homey.json', 8092, '666-66-666');

  server = new HAS.Server(config);

  // Create bridge
  server.config.getHASID(homey.wifiMac);
  let bridge = new HAS.Accessory(1);

  // What happens when a user presses identify in the Home app (Idea: add speech output?)
  let identify = HAS.predefined.Identify(1, undefined, (value, callback) =>
    {
            callback(HAS.statusCodes.OK);
    }),
    manufacturer = HAS.predefined.Manufacturer(2, homey.release),
    model = HAS.predefined.Model(3, homey.homeyModelName),
    name = HAS.predefined.Name(4, homey.hostname),
    serialNumber = HAS.predefined.SerialNumber(5, homey.cloudId),
    firmwareVersion = HAS.predefined.FirmwareRevision(6, homey.homeyVersion);

  bridge.addServices(HAS.predefined.AccessoryInformation(1, [identify, manufacturer, model, name, serialNumber, firmwareVersion]));

  // Add bridge to the server
  server.addAccessory(bridge);
  server.onIdentify = identify.onWrite;

  if (debug) console.log('Server config done.', 'success');

  return server;
}

function createNewDevice(device, server, newPairedDevices, id)
{
  let homeKitID = server.config.getHASID(id);
  let newDevice = new HAS.Accessory(homeKitID);
  newPairedDevices[device.id].homeKitIDs[homeKitID] = id;

  let Identify = HAS.predefined.Identify(1, undefined, function(value, callback)
    {
      callback(HAS.statusCodes.OK);
    }),
    Manufacturer = HAS.predefined.Manufacturer(2, device.driverUri),
    Model = HAS.predefined.Model(3, device.driverId),
    Name = HAS.predefined.Name(4, device.name),
    SerialNumber = HAS.predefined.SerialNumber(5, device.id),
    FirmwareVersion = HAS.predefined.FirmwareRevision(6, '1.0.0');

  newDevice.addServices(HAS.predefined.AccessoryInformation(1, [Identify, Manufacturer, Model, Name, SerialNumber, FirmwareVersion]));

  return newDevice;
}

async function createDevice(device, server, group, newPairedDevices)
{
  //console.log('capabilities: '+ JSON.stringify(device.capabilities));
  //console.log('______________');
  if (debug) console.log(device.name + ' full info: '+ JSON.stringify(device));
  //console.log('1111: '+ JSON.stringify(device.capabilities));
  //console.log('2222: '+ JSON.stringify(device.capabilitiesObj));
  // Create empty capabilities array
  let arrState = {}
  let capabilities = []
  let variableState = undefined
  let newDevice = undefined
  let idKey = undefined

  let serviceNum = 2
  let characteristicNum = 7
  let opposite = (device.name[0] == '~')?true:false

  if (group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id);

  for (let key in device.capabilitiesObj)
	{
    //console.log(device.name + ' key: ' + device.capabilitiesObj[key].id, 'info');
    //console.log(device.name + ' title: ' + device.capabilities[key].title.en, 'info');
    if (!group)
    {
      serviceNum = 2;
      characteristicNum = 7;
    }
    capabilities = [];

    idKey = device.capabilitiesObj[key].id;
    idKey = idKey.replace(/[-0-9.]/gim,'');

    switch (idKey)
    {

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'onoff':

        if(device.class == 'windowcoverings') break;

        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);
        let lightBulb = false;

        if (device.class == 'fan')
        {
          variableState = HAS.predefined.Active(characteristicNum++, undefined, (value, callback) =>
          {
            updateStatus (device, value == 1, key, callback);
          });
          updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, key, device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key] = variableState;

          if ('dim' in device.capabilitiesObj)
          {
            variableState = HAS.predefined.RotationSpeed(characteristicNum++, undefined, (value, callback) =>
            {
              updateStatus (device, value / 100, 'dim', callback);
            });
            updateStatusOnHKNoNull(Math.round(sDV(device.capabilitiesObj.dim.value, 1) * 100), variableState, 'dim', device);
            if (test) testStab(variableState, key, device);

            capabilities.push(variableState);
            arrState['dim'] = variableState;
          }

        }
        else
        {
          variableState = HAS.predefined.On(characteristicNum++, undefined, (value, callback) =>
          {
            if ('dim' in device.capabilitiesObj)
            {
              setTimeout(updateStatus, 1, device, value, key, callback);
            }else
            {
              updateStatus (device, value, key, callback);
            }
          });
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, false), variableState, key, device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key] = variableState;

          if ('dim' in device.capabilitiesObj)
          {
            lightBulb = true;

            variableState = HAS.predefined.Brightness(characteristicNum++, undefined, (value, callback) =>
            {
              updateStatus (device, value / 100, 'dim', callback);
            });
            updateStatusOnHKNoNull(Math.round(sDV(device.capabilitiesObj.dim.value, 1) * 100), variableState, 'dim', device);
            if (test) testStab(variableState, key, device);

            capabilities.push(variableState);
            arrState['dim'] = variableState;
          }

          if ('light_hue' in device.capabilitiesObj)
          {
            lightBulb = true;

            variableState = HAS.predefined.Hue(characteristicNum++, undefined, (value, callback) =>
            {
              updateStatus (device, Math.round((value / 360)*100)/100, 'light_hue', callback);
            });
            updateStatusOnHKNoNull(Math.round(sDV(device.capabilitiesObj.light_hue.value, 1) * 360), variableState, 'light_hue', device);
            if (test) testStab(variableState, key, device);

            capabilities.push(variableState);
            arrState['light_hue'] = variableState;
          }

          if ('light_saturation' in device.capabilitiesObj)
          {
            lightBulb = true;

            variableState = HAS.predefined.Saturation(characteristicNum++, undefined, (value, callback) =>
            {
              updateStatus (device, value / 100, 'light_saturation', callback);
            });
            updateStatusOnHKNoNull(Math.round(sDV(device.capabilitiesObj.light_saturation.value, 1) * 100), variableState, 'light_saturation', device);
            if (test) testStab(variableState, key, device);

            capabilities.push(variableState);
            arrState['light_saturation'] = variableState;
          }
          else if ('light_hue' in device.capabilitiesObj)
          {
            lightBulb = true;

            variableState = HAS.predefined.Saturation(characteristicNum++, 100);
            capabilities.push(variableState);
          }

          if ('light_temperature' in device.capabilitiesObj)
          {
            lightBulb = true;

            variableState = HAS.predefined.ColorTemperature(characteristicNum++, undefined, (value, callback) =>
            {
              updateStatus (device, Math.round(((value - 140) / 360)*100)/100, 'light_temperature', callback);
            });
            updateStatusOnHKNoNull(Math.round(140 + sDV(device.capabilitiesObj.light_temperature.value, 0) * 360), variableState, 'light_temperature', device);
            if (test) testStab(variableState, key, device);

            capabilities.push(variableState);
            arrState['light_temperature'] = variableState;
          }

        }

        if (device.class == 'light' || lightBulb == true)
        {
          newDevice.addServices(HAS.predefined.Lightbulb(serviceNum++, capabilities));
        }
        else if (device.class == 'fan')
        {
          newDevice.addServices(HAS.predefined.Fanv2(serviceNum++, capabilities));
        }
        else if(device.class == 'heater' || device.class == 'car_alarm')
        {
          newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        }
        else
        {
          variableState = HAS.predefined.OutletInUse(characteristicNum++, true);
          capabilities.push(variableState);

          newDevice.addServices(HAS.predefined.Outlet(serviceNum++, capabilities));
        }
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'locked':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.LockCurrentState(characteristicNum++);
        updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, 'LockCurrentState', device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key+'LockCurrentState'] = variableState;

        variableState = HAS.predefined.LockTargetState(characteristicNum++, undefined, (value, callback) =>
        {
          updateStatus (device, value == 1, key, callback);
        });
        updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.LockMechanism(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_co2':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.AirQuality(characteristicNum++);
        updateStatusOnHKNoNull(co2AirQuality(sDV(device.capabilitiesObj[key].value, 0)), variableState, key+'AirQuality', device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key+'AirQuality'] = variableState;

        newDevice.addServices(HAS.predefined.AirQualitySensor(serviceNum++, capabilities));
        capabilities = [];

        variableState = HAS.predefined.CarbonDioxideLevel(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.CarbonDioxidePeakLevel(characteristicNum++, 1600);
        capabilities.push(variableState);

        if ('alarm_co2' in device.capabilitiesObj)
        {
          variableState = HAS.predefined.CarbonDioxideDetected(characteristicNum++);
          updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj.alarm_co2.value, false)), variableState, 'alarm_co2', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['alarm_co2'] = variableState;

        }else
        {
          variableState = HAS.predefined.CarbonDioxideDetected(characteristicNum++);
          updateStatusOnHKNoNull(co2CarbonDioxideDetected(sDV(device.capabilitiesObj[key].value, 0)), variableState, key+'CarbonDioxideDetected', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key+'CarbonDioxideDetected'] = variableState;
        }

        newDevice.addServices(HAS.predefined.CarbonDioxideSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_battery':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.BatteryLevel(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 100), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.ChargingState(characteristicNum++, 2);
        capabilities.push(variableState);

        if ('alarm_battery' in device.capabilitiesObj)
        {
          variableState = HAS.predefined.StatusLowBattery(characteristicNum++);
          updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj.alarm_battery.value, false)), variableState, 'alarm_battery', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['alarm_battery'] = variableState;

        }else
        {
          variableState = HAS.predefined.StatusLowBattery(characteristicNum++);
          updateStatusOnHKNoNull(alarmBattery(sDV(device.capabilitiesObj[key].value, 100)), variableState, key+'StatusLowBattery', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key+'StatusLowBattery'] = variableState;
        }

        newDevice.addServices(HAS.predefined.BatteryService(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'speaker_playing':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (Play/Pause)");
        capabilities.push(variableState);

        variableState = HAS.predefined.On(characteristicNum++, undefined, (value, callback) =>
        {
          callback(HAS.statusCodes.OK);
          updateStatus (device, value, key, callback);
        });
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, false), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_temperature':
        if (device.class != 'thermostat')
        {
          if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

          variableState = HAS.predefined.CurrentTemperature(characteristicNum++);
          variableState.minValue = - variableState.maxValue;
          variableState.stepValue = 0.01;
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
          //updateStatusOnHKNoNull(1.11, variableState, key, device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key] = variableState;

          newDevice.addServices(HAS.predefined.TemperatureSensor(serviceNum++, capabilities));
          if (!group) await server.addAccessory(newDevice);
        }
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'target_temperature':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        if ('thermostat_mode' in device.capabilitiesObj)
        {
          arrState['thermostat_mode'] = true;

          variableState = HAS.predefined.TargetHeatingCoolingState(characteristicNum++, undefined, (value, callback) =>
          {
            let variable = 'off';
            if (value == 1)
            {
              variable = 'heat';
            }
            else if (value == 2)
            {
              variable = 'cool';
            }
            else if (value == 3)
            {
              variable = 'auto';
            }
            updateStatus (device, variable, 'thermostat_mode', callback);
          });
          updateStatusOnHKNoNull(thermostatMode2targetHeatingCoolingState(sDV(device.capabilitiesObj.thermostat_mode.value, 'cool')), variableState, 'TargetHeatingCoolingState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['TargetHeatingCoolingState'] = variableState;

          variableState = HAS.predefined.CurrentHeatingCoolingState(characteristicNum++);
          updateStatusOnHKNoNull(thermostatMode2currentHeatingCoolingState(sDV(device.capabilitiesObj.thermostat_mode.value, 'cool')), variableState, 'CurrentHeatingCoolingState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['CurrentHeatingCoolingState'] = variableState;

        }else if ('eurotronic_mode' in device.capabilitiesObj)
        {
          arrState['eurotronic_mode'] = true;

          variableState = HAS.predefined.TargetHeatingCoolingState(characteristicNum++, undefined, (value, callback) =>
          {
            let variable = 'Off'//off;
            if (value == 1)
            {
              variable = 'MANUFACTURER SPECIFC'//heat;
            }
            else if (value == 2)
            {
              variable = 'Energy Save Heat'//cool;
            }
            else if (value == 3)
            {
              variable = 'Heat'//auto;
            }
            updateStatus (device, variable, 'eurotronic_mode', callback);
          });
          updateStatusOnHKNoNull(eurotronicMode2targetHeatingCoolingState(sDV(device.capabilitiesObj.eurotronic_mode.value, 'Energy Save Heat')), variableState, 'TargetHeatingCoolingState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['TargetHeatingCoolingState'] = variableState;

          variableState = HAS.predefined.CurrentHeatingCoolingState(characteristicNum++);
          updateStatusOnHKNoNull(eurotronicMode2currentHeatingCoolingState(sDV(device.capabilitiesObj.eurotronic_mode.value, 'Energy Save Heat')), variableState, 'CurrentHeatingCoolingState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['CurrentHeatingCoolingState'] = variableState;
        }
        else
        {
          variableState = HAS.predefined.TargetHeatingCoolingState(characteristicNum++, undefined, (value, callback) =>
          {
            let variable = device.capabilitiesObj[key].value;

            if (value == 1)
            {
              variable = 25;
            }
            else if (value == 2)
            {
              variable = 20;
            }
            else if (value == 3)
            {
              variable = 23;
            }
            updateStatus (device, variable, key, callback);
          });
          updateStatusOnHKNoNull(targeTemperature2thermostatMode(sDV(device.capabilitiesObj[key].value, 20)), variableState, 'TargetHeatingCoolingState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key + 'TargetHeatingCoolingState'] = variableState;

          variableState = HAS.predefined.CurrentHeatingCoolingState(characteristicNum++);
          updateStatusOnHKNoNull(targeTemperature2currentThermostatMode(sDV(device.capabilitiesObj[key].value, 20)), variableState, 'CurrentHeatingCoolingState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key + 'CurrentHeatingCoolingState'] = variableState;
        }

        let max = 28;
        if ('max' in device.capabilitiesObj[key])
        {
          max = device.capabilitiesObj[key].max;
        }

        let min = 10;
        if ('min' in device.capabilitiesObj[key])
        {
          min = device.capabilitiesObj[key].min;
        }

        variableState = HAS.predefined.TargetTemperature(characteristicNum++, undefined, (value, callback) =>
        {
          value = value > max?max:value;
          updateStatus (device, value, key, callback);
          if ('measure_temperature' in device.capabilitiesObj == false)
          {
            updateStatusOnHKNoNull(value, arrState['measure_temperature'], 'measure_temperature', device);
            if (test) testStab(variableState, key, device);
          }
        });
        variableState.minValue = min;
        variableState.maxValue = max;
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 20), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.TemperatureDisplayUnits(characteristicNum++, 0);
        capabilities.push(variableState);

        variableState = HAS.predefined.CurrentTemperature(characteristicNum++);
        variableState.minValue = - variableState.maxValue;
        variableState.stepValue = 0.01;
        if ('measure_temperature' in device.capabilitiesObj)
        {
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj.measure_temperature.value, 0), variableState, 'measure_temperature', device);
          if (test) testStab(variableState, key, device);
        }
        else
        {
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 20), variableState, 'measure_temperature', device);
          if (test) testStab(variableState, key, device);
        }
        capabilities.push(variableState);
        arrState['measure_temperature'] = variableState;

        newDevice.addServices(HAS.predefined.Thermostat(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'windowcoverings_state':
        if ('dim' in device.capabilitiesObj == false)
        {
          if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

          variableState = HAS.predefined.CurrentPosition(characteristicNum++);
          updateStatusOnHKNoNull(stateCover2proc(sDV(device.capabilitiesObj[key].value, 'idle'),opposite), variableState, key, device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key] = variableState;

          variableState = HAS.predefined.TargetPosition(characteristicNum++, undefined, (value, callback) =>
          {
            let variable = 'idle';
            if (value == 100)
            {
              variable = (opposite?'down':'up')
            }
            else if (value == 0)
            {
              variable = (opposite?'up':'down')
            }
            updateStatus (device, variable, key, callback);
          });
          updateStatusOnHKNoNull(stateCover2proc(sDV(device.capabilitiesObj[key].value, 'idle'),opposite), variableState, key+'TargetPosition', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key+'TargetPosition'] = variableState;

          variableState = HAS.predefined.PositionState(characteristicNum++);
          updateStatusOnHKNoNull(stateCover2num(sDV(device.capabilitiesObj[key].value, 'idle'),opposite), variableState, key+'PositionState', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);

          newDevice.addServices(HAS.predefined.WindowCovering(serviceNum++, capabilities));
          if (!group) await server.addAccessory(newDevice);
        }
        break;

      case 'dim':
        if (device.class == 'windowcoverings')
        {
          if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

          variableState = HAS.predefined.CurrentPosition(characteristicNum++);
          updateStatusOnHKNoNull( (opposite?-1:1) * sDV(device.capabilitiesObj[key].value, 1) * 100 + (opposite?100:0), variableState, key+'dim', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key + 'dim'] = variableState;

          variableState = HAS.predefined.TargetPosition(characteristicNum++, undefined, (value, callback) =>
          {
            updateStatus (device, (opposite?-1:1) * value/100  + (opposite?1:0), key, callback);
          });
          updateStatusOnHKNoNull( (opposite?-1:1) * sDV(device.capabilitiesObj[key].value, 1) * 100 + (opposite?100:0), variableState, key, device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key] = variableState;

          if ('windowcoverings_state' in device.capabilitiesObj)
          {
            variableState = HAS.predefined.PositionState(characteristicNum++);
            updateStatusOnHKNoNull(stateCover2num(sDV(device.capabilitiesObj.windowcoverings_state.value, 'idle'),opposite), variableState, key + 'windowcoverings_state', device);
            if (test) testStab(variableState, key, device);

            capabilities.push(variableState);
          }
          else
          {
            variableState = HAS.predefined.PositionState(characteristicNum++, 2);
            capabilities.push(variableState);
          }

          newDevice.addServices(HAS.predefined.WindowCovering(serviceNum++, capabilities));
          if (!group) await server.addAccessory(newDevice);
        }
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'volume_set':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.Volume(characteristicNum++, undefined, (value, callback) =>
        {
          updateStatus (device, value / 100, key, callback);
        });
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0.1) * 100, variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        if ('volume_mute' in device.capabilitiesObj)
        {
          variableState = HAS.predefined.Mute(characteristicNum++, undefined, (value, callback) =>
          {
            updateStatus (device, value, "volume_mute", callback);
          });
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj.volume_mute.value, false), variableState, 'volume_mute', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['volume_mute'] = variableState;
        }else
        {
          variableState = HAS.predefined.Mute(characteristicNum++, undefined, (value, callback) =>
          {
            updateStatus (device, (value ? 0: 20/100), key, callback);
          });
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0) == 0, variableState, key + 'Mute', device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState[key + 'Mute'] = variableState;
        }

        newDevice.addServices(HAS.predefined.Speaker(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'vacuumcleaner_state':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.On(characteristicNum++, undefined, (value, callback) =>
        {
          updateStatus (device, (value ? "cleaning": "docked"), key, callback);
        });
        updateStatusOnHKNoNull(vacuumcleaner2state(sDV(device.capabilitiesObj[key].value, 'stopped')), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.OutletInUse(characteristicNum++, true);
        capabilities.push(variableState);

        newDevice.addServices(HAS.predefined.Outlet(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_generic':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (Button)");
        capabilities.push(variableState);

        variableState = HAS.predefined.MotionDetected(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, false), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.MotionSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_water':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.LeakDetected(characteristicNum++);
        updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.LeakSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_smoke':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.SmokeDetected(characteristicNum++);
        updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.SmokeSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_aqi':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.AirQuality(characteristicNum++);
        updateStatusOnHKNoNull(aqi2AirQualityMainlandChina(sDV(device.capabilitiesObj[key].value, 0)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.AirQualitySensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_contact':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.ContactSensorState(characteristicNum++);
        updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.ContactSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_motion':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.MotionDetected(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, false), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.MotionSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_humidity':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.CurrentRelativeHumidity(characteristicNum++);
        variableState.stepValue = 0.01;
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        //updateStatusOnHKNoNull(1.11, variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.HumiditySensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_luminance':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.CurrentAmbientLightLevel(characteristicNum++);
        variableState.minValue = - variableState.maxValue;
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.LightSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_tamper':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.OccupancyDetected(characteristicNum++);
        updateStatusOnHKNoNull(state2num(sDV(device.capabilitiesObj[key].value, false)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.OccupancySensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'homealarm_state':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.SecuritySystemCurrentState(characteristicNum++);

        updateStatusOnHKNoNull(homealarm_state2SecuritySystemTargetState(sDV(device.capabilitiesObj[key].value, 'disarmed')), variableState, key + 'CurrentState', device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key + 'CurrentState'] = variableState;

        variableState = HAS.predefined.SecuritySystemTargetState(characteristicNum++, undefined, (value, callback) =>
        {
          let variable = 'disarmed';

          if (value == 0)
          {
            variable = 'partially_armed';
          }
          else if (value == 1)
          {
            variable = 'armed';
          }
          else if (value == 2)
          {
            variable = 'partially_armed';
          }
          else if (value == 3)
          {
            variable = 'disarmed';
          }
          callback(HAS.statusCodes.OK);
          updateStatus (device, variable, key, callback);
        });

        updateStatusOnHKNoNull(homealarm_state2SecuritySystemTargetState(sDV(device.capabilitiesObj[key].value, 'disarmed')), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.SecuritySystem(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_power':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = NewTypes.Watts(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        if ('meter_power' in device.capabilitiesObj)
        {
          variableState = NewTypes.KilowattHours(characteristicNum++);
          updateStatusOnHKNoNull(sDV(device.capabilitiesObj.meter_power.value, 0), variableState, key, device);
          if (test) testStab(variableState, key, device);

          capabilities.push(variableState);
          arrState['meter_power'] = variableState;
        }

        newDevice.addServices(NewTypes.PowerMeter(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_pressure':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = NewTypes.CurrentAtmosphericPressure(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(NewTypes.AtmosphericPressureSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_noise':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = NewTypes.CurrentNoiseLevel(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(NewTypes.NoiseLevelSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_ultraviolet':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = NewTypes.CurrentUltraviolet(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(NewTypes.UltravioletSensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_pm25':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.AirQuality(characteristicNum++);
        updateStatusOnHKNoNull(p252AirQuality(sDV(device.capabilitiesObj[key].value, 0)), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key + 'AirQuality'] = variableState;

        variableState = HAS.predefined.PM25Density(characteristicNum++);
        updateStatusOnHKNoNull(sDV(device.capabilitiesObj[key].value, 0), variableState, key, device);
        if (test) testStab(variableState, key, device);

        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.AirQualitySensor(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      /////NO FEADBECK
      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'button':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.On(characteristicNum++, false, (value, callback) =>
        {
          try
          {
            device.setCapabilityValue(key, value);
          } catch(error)
          {
            console.log(device.name + ': ' + error, 'error');
          }
          callback(HAS.statusCodes.OK);
          setTimeout(setOffForButton, 100, variableState);
        });
        capabilities.push(variableState);
        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      case 'speaker_next':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (next)");
        capabilities.push(variableState);

        variableState = HAS.predefined.On(characteristicNum++, false, (value, callback) =>
        {
          try
          {
            device.setCapabilityValue(key, value);
          } catch(error)
          {
            console.log(device.name + ': ' + error, 'error');
          }
          callback(HAS.statusCodes.OK);
          setTimeout(setOffForButton, 100, variableState);
        });
        capabilities.push(variableState);

        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

      case 'speaker_prev':
        if (!group) newDevice = createNewDevice(device, server, newPairedDevices ,device.id + key);

        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (Prev)");
        capabilities.push(variableState);

        variableState = HAS.predefined.On(characteristicNum++, false, (value, callback) =>
        {
          try
          {
            device.setCapabilityValue(key, value);
          } catch(error)
          {
            console.log(device.name + ': ' + error, 'error');
          }
          callback(HAS.statusCodes.OK);
          setTimeout(setOffForButton, 100, variableState);
        });
        capabilities.push(variableState);

        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        if (!group) await server.addAccessory(newDevice);
        break;

    }
  }

  if (group)
  {
    await server.addAccessory(newDevice);
  }
/*
  device.makeCapabilityInstance('onoff', async (variable) => {
    updateStatusOnHKNoNull((device.class == 'fan' ? state2num(variable): variable), arrState[key], key, device);
  });*/

  if (debug) console.log('State in HomeKit: ' +  JSON.stringify(arrState), "info");

  if (JSON.stringify(arrState) != '{}')
  {
    for (let key in arrState)
    {

        if (key in device.capabilitiesObj)
        {

          idKey = device.capabilitiesObj[key].id;
          idKey = idKey.replace(/[-0-9.]/gim,'');

          switch (idKey)
          {
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'onoff':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull((device.class == 'fan' ? state2num(variable): variable), arrState[key], key, device);
              });
              break;

            case 'dim':
              device.makeCapabilityInstance(key, async (variable) => {
                if(device.class == 'windowcoverings')
                {
                  variable = (opposite?-1:1) * Math.round(variable * 100) + (opposite?100:0)
                  updateStatusOnHKNoNull(variable, arrState[key], key, device)
                  updateStatusOnHKNoNull(variable, arrState[key + 'dim'], key + 'dim', device)
                }else
                {
                  variable = Math.round(variable * 100)
                  updateStatusOnHKNoNull(variable, arrState[key], key, device)
                }
              });
              break;

            case 'light_hue':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(Math.round(variable * 360), arrState[key], key, device);
              });
              break;

            case 'light_saturation':
              device.makeCapabilityInstance(key, async (variable) => {
                if ('light_hue' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(Math.round(variable * 100), arrState[key], key, device);
                }
              });
              break;

            case 'light_temperature':
              device.makeCapabilityInstance(key, async (variable) => {
                if ('light_hue' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(Math.round(140 + variable * 360), arrState[key], key, device);
                }
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'locked':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                updateStatusOnHKNoNull(state2num(variable), arrState[key+'LockCurrentState'], key+'LockCurrentState', device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_co2':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                updateStatusOnHKNoNull(co2AirQuality(variable), arrState[key+'AirQuality'], key+'AirQuality', device);

                if ('alarm_co2' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(co2CarbonDioxideDetected(variable), arrState[key+'CarbonDioxideDetected'], key+'CarbonDioxideDetected', device);
                }
              });
              break;

            case 'alarm_co2':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_battery':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);

                if ('alarm_battery' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(alarmBattery(variable), arrState[key+'StatusLowBattery'], key+'StatusLowBattery', device);
                }
              });
              break;

            case 'alarm_battery':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'speaker_playing':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull((variable != null ? variable: false), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_temperature':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable,arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'thermostat_mode':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(thermostatMode2targetHeatingCoolingState(variable), arrState['TargetHeatingCoolingState'], 'targetHeatingCoolingState', device);
                updateStatusOnHKNoNull(thermostatMode2currentHeatingCoolingState(variable), arrState['CurrentHeatingCoolingState'], 'currentHeatingCoolingState', device);
              });
              break;

            case 'eurotronic_mode':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(eurotronicMode2targetHeatingCoolingState(variable), arrState['TargetHeatingCoolingState'], 'targetHeatingCoolingState', device);
                updateStatusOnHKNoNull(eurotronicMode2currentHeatingCoolingState(variable), arrState['CurrentHeatingCoolingState'], 'currentHeatingCoolingState', device);
              });
              break;

            case 'target_temperature':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                if ('measure_temperature' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(variable, arrState['measure_temperature'],'measure_temperature', device);
                }
                if ('thermostat_mode' in device.capabilitiesObj == false && 'eurotronic_mode' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(targeTemperature2currentThermostatMode(variable), arrState[key + 'CurrentHeatingCoolingState'],key + 'currentHeatingCoolingState', device);
                  updateStatusOnHKNoNull(targeTemperature2thermostatMode(variable), arrState[key + 'TargetHeatingCoolingState'],key + 'targetHeatingCoolingState', device);
                }
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'windowcoverings_state':
              device.makeCapabilityInstance(key, async (variable) => {
                if ('dim' in device.capabilitiesObj == false)
                {
                  variable = stateCover2proc(variable,opposite);

                  updateStatusOnHKNoNull(variable, arrState[key], key, device);
                  updateStatusOnHKNoNull(variable, arrState[key+'TargetPosition'], key+'TargetPosition', device);
                }
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'volume_set':
              device.makeCapabilityInstance(key, async (variable) => {
                variable = Math.round(variable * 100);

                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                if ('volume_mute' in device.capabilitiesObj == false)
                {
                  updateStatusOnHKNoNull(variable==0, arrState[key+'Mute'], key+'Mute', device);
                }
              });
              break;

            case 'volume_mute':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'vacuumcleaner_state':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(vacuumcleaner2state(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'alarm_generic':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'alarm_water':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'alarm_smoke':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_aqi':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(aqi2AirQualityMainlandChina(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'alarm_contact':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'alarm_motion':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_humidity':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_luminance':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'alarm_tamper':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'homealarm_state':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(homealarm_state2SecuritySystemTargetState(variable), arrState[key], key, device);
                updateStatusOnHKNoNull(homealarm_state2SecuritySystemTargetState(variable), arrState[key + 'CurrentState'], key + 'CurrentState', device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_power':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'meter_power':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState['meter_power'], 'meter_power', device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_pressure':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_noise':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;

            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_ultraviolet':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            case 'measure_pm25':
              device.makeCapabilityInstance(key, async (variable) => {
                updateStatusOnHKNoNull(p252AirQuality(variable), arrState[key + 'AirQuality'], key + 'AirQuality', device);
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
              });
              break;
          }
        }
      }
  }else
  {
    console.log('NO realtime event from: ' + device.name, "info");
  }

}


module.exports = {
  configServer: configServer,
  createDevice: createDevice
}
