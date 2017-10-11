'use strict'
const HAS = require('has-node');

function configServer(homey)
{
  function reverseStr(str)
  {
    return str.split("").reverse().join("");
  }

  let server = {};

  // Config for server
  const config = new HAS.Config(homey.hostname + ' ' + homey.cloud_id, reverseStr(homey.wifi_mac), HAS.categories.bridge, '../userdata/homey.json', 8091, '666-66-666');
  server = new HAS.Server(config);

  // Create bridge
  const bridge = new HAS.Accessory(config.getHASID(homey.network.wlan0[0].mac));

  // What happens when a user presses identify in the Home app (Idea: add speech output?)
  const identify = HAS.predefined.Identify(1, undefined, function(value, callback) {
    callback(HAS.statusCodes.OK);
  });

  // Set device information for the bridge
  const manufacturer = HAS.predefined.Manufacturer(2, 'Athom');
  const model = HAS.predefined.Model(3, 'V1');
  const name = HAS.predefined.Name(4, homey.hostname);
  const serialNumber = HAS.predefined.SerialNumber(5, homey.cloud_id);
  const firmwareVersion = HAS.predefined.FirmwareRevision(6, homey.homey_version);

  // Add all services to the created bridge accesory
  bridge.addServices(HAS.predefined.AccessoryInformation(1, [identify, manufacturer, model, name, serialNumber, firmwareVersion]));

  // Add bridge to the server
  server.addAccessory(bridge);
  server.onIdentify = identify.onWrite;
  console.log('Server config done.', 'success');
  // Return server to app.js
  return server;
}


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

function stateCover2num(state)
{
  if (state=='up')
  {
    return 1;
  }
  else if(state=='down')
  {
    return 0;
  }else
  {
    return 2;
  }
}
function stateCover2proc(state)
{
  if (state=='down')
  {
    return 0;
  }
  else if(state=='up')
  {
    return 100;
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

function setOffForButton(onButton)
{
  onButton.setValue(false);
}

async function updateStatus(device,variable,status,callback)
{
  if (device.available)
  {
    if (device.state[status] != variable && variable != null)
    {
      console.log(device.name + ': set ' + status + " = " + device.state[status] + " => " + variable, 'info');

      if (('zw_wakeup_interval' in device.settings) && (device.settings.zw_wakeup_interval > 15))
      {
        console.log(device.name + ': zw_wakeup_interval = ' + device.settings.zw_wakeup_interval, 'info');
        device.setCapabilityValue(status, variable);
        callback(HAS.statusCodes.Ok);
      }else
      {
        try
        {
          await device.setCapabilityValue(status, variable);
          callback(HAS.statusCodes.Ok);
        } catch(error)
        {
          console.log(device.name + ': ' + error, 'error');
          //use another status code based on error and then callback it
          if (error == 'Error: senddata_timeout')
          {
            callback(HAS.statusCodes.timedout);
          }else if (error == 'Error: TRANSMIT_COMPLETE_NO_ACK')
          {
            callback(HAS.statusCodes.Ok);
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
    console.log(device.name + ': not available ', 'error');
    callback(HAS.statusCodes.busy);
  }
}

function updateStatusOnHKNoNull(variable, deviceHK, status, device)
{
  if (deviceHK.value != variable)
  {
    console.log('Update: '+ device.name + ' ' + status + ': ' + deviceHK.value + ' new: ' + variable, "info");
    deviceHK.setValue(variable);
  }
}


function createDevice(device, id)
{
  //console.log('capabilities: '+ JSON.stringify(device.capabilities));
  //console.log('______________');
  console.log(device.name + ' full info: '+ JSON.stringify(device));

  let serviceNum = 1;
  let characteristicNum = 1;

  // New device
  const newDevice = new HAS.Accessory(id);

  const lightIdentify = HAS.predefined.Identify(characteristicNum++, undefined, function(value, callback)
  {
    callback(HAS.statusCodes.OK);
  });

  // Set light details
  const lightManufacturer = HAS.predefined.Manufacturer(characteristicNum++, device.driver.owner_name);
  const lightModel = HAS.predefined.Model(characteristicNum++, device.driver.id);
  const lightName = HAS.predefined.Name(characteristicNum++, device.name);
  const lightSerialNumber = HAS.predefined.SerialNumber(characteristicNum++, device.id);
  const lightFirmwareVersion = HAS.predefined.FirmwareRevision(characteristicNum++, '1.0.0');
  // Add services to the light
  newDevice.addServices(HAS.predefined.AccessoryInformation(serviceNum++, [lightIdentify, lightManufacturer, lightModel, lightName, lightSerialNumber, lightFirmwareVersion]));

  // Create empty capabilities array
  var arrState = {};
  let capabilities = [];
  let variableState = 0;

  for (let key in device.capabilities)
	{
    //console.log(device.name + ' key: ' + device.capabilities[key].id, 'info');
    //console.log(device.name + ' title: ' + device.capabilities[key].title.en, 'info');

    switch (device.capabilities[key].id)
    {

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'onoff':
        if (device.class == 'fan')
        {
          variableState = HAS.predefined.Active(characteristicNum++, state2num(device.state[key]|| false), (value, callback) =>
          {
            updateStatus (device, value == 1, key, callback);
          });
        }
        else
        {
          variableState = HAS.predefined.On(characteristicNum++, device.state[key] || false, (value, callback) =>
          {
            if ('dim' in device.capabilities)
            {
              setTimeout(updateStatus, 1, device, value, key, callback);
            }else
            {
              updateStatus (device, value, key, callback);
            }
          });
        }
        capabilities.push(variableState);
        arrState[key] = variableState;

        if ('dim' in device.capabilities)
        {
          variableState = HAS.predefined.Brightness(characteristicNum++, Math.floor(device.state.dim * 100 || 100), (value, callback) =>
          {
            updateStatus (device, value / 100, 'dim', callback);
          });
          capabilities.push(variableState);
          arrState['dim'] = variableState;
        }

        if ('light_hue' in device.capabilities)
        {
          variableState = HAS.predefined.Hue(characteristicNum++, Math.floor(device.state.light_hue * 360 || 360), (value, callback) =>
          {
            updateStatus (device, Math.ceil((value / 360)*100)/100, 'light_hue', callback);
          });
          capabilities.push(variableState);
          arrState['light_hue'] = variableState;
        }

        if ('light_saturation' in device.capabilities)
        {
          variableState = HAS.predefined.Saturation(characteristicNum++, Math.floor(device.state.light_saturation * 100 || 100), (value, callback) =>
          {
            updateStatus (device, value / 100, 'light_saturation', callback);
          });
          capabilities.push(variableState);
          arrState['light_saturation'] = variableState;
        }
        else if ('light_hue' in device.capabilities)
        {
          variableState = HAS.predefined.Saturation(characteristicNum++, 100);
          capabilities.push(variableState);
        }

        if ('light_temperature' in device.capabilities)
        {
          variableState = HAS.predefined.ColorTemperature(characteristicNum++, Math.floor(140 + device.state.light_temperature * 360 || 140), (value, callback) =>
          {
            updateStatus (device, Math.ceil(((value - 140) / 360)*100)/100, 'light_temperature', callback);
          });
          capabilities.push(variableState);
          arrState['light_temperature'] = variableState;
        }

        if (device.class == 'light')
        {
          newDevice.addServices(HAS.predefined.Lightbulb(serviceNum++, capabilities));
        }
        else if (device.class == 'fan')
        {
          newDevice.addServices(HAS.predefined.Fanv2(serviceNum++, capabilities));
        }
        else if(device.class == 'heater')
        {
          newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        }
        else
        {
          variableState = HAS.predefined.OutletInUse(characteristicNum++, true);
          capabilities.push(variableState);

          newDevice.addServices(HAS.predefined.Outlet(serviceNum++, capabilities));
        }
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'locked':
        variableState = HAS.predefined.LockCurrentState(characteristicNum++, state2num(device.state[key] || false));
        capabilities.push(variableState);

        variableState = HAS.predefined.LockTargetState(characteristicNum++, state2num(device.state[key] || false), (value, callback) =>
        {
          updateStatus (device, value == 1, key, callback);
        });
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.LockMechanism(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_co2':
        variableState = HAS.predefined.AirQuality(characteristicNum++, co2AirQuality(device.state[key] || 0));
        capabilities.push(variableState);
        arrState[key+'AirQuality'] = variableState;

        newDevice.addServices(HAS.predefined.AirQualitySensor(serviceNum++, capabilities));
        capabilities = [];

        variableState = HAS.predefined.CarbonDioxideLevel(characteristicNum++, device.state[key] || 0);
        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.CarbonDioxidePeakLevel(characteristicNum++, 1600);
        capabilities.push(variableState);

        if ('alarm_co2' in device.capabilities)
        {
          variableState = HAS.predefined.CarbonDioxideDetected(characteristicNum++, state2num(device.state.alarm_co2 || false));
          capabilities.push(variableState);
          arrState['alarm_co2'] = variableState;

        }else
        {
          variableState = HAS.predefined.CarbonDioxideDetected(characteristicNum++, co2CarbonDioxideDetected(device.state[key] || 0));
          capabilities.push(variableState);
          arrState[key+'CarbonDioxideDetected'] = variableState;
        }

        newDevice.addServices(HAS.predefined.CarbonDioxideSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_battery':
        variableState = HAS.predefined.BatteryLevel(characteristicNum++, device.state[key] || 100);
        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.ChargingState(characteristicNum++, 2);
        capabilities.push(variableState);

        if ('alarm_battery' in device.capabilities)
        {
          variableState = HAS.predefined.StatusLowBattery(characteristicNum++, state2num(device.state.alarm_battery || false));
          capabilities.push(variableState);
          arrState['alarm_battery'] = variableState;

        }else
        {
          variableState = HAS.predefined.StatusLowBattery(characteristicNum++, alarmBattery(device.state[key] || 100));
          capabilities.push(variableState);
          arrState[key+'StatusLowBattery'] = variableState;
        }

        newDevice.addServices(HAS.predefined.BatteryService(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'speaker_playing':
        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (Play/Pause)");
        capabilities.push(variableState);

        variableState = HAS.predefined.On(characteristicNum++, device.state[key] || false, (value, callback) =>
        {
          callback(HAS.statusCodes.OK);
          updateStatus (device, value, key, callback);
        });
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_temperature':
        if (device.class != 'thermostat')
        {
          variableState = HAS.predefined.CurrentTemperature(characteristicNum++, device.state[key] || 0);
          capabilities.push(variableState);
          arrState[key] = variableState;

          newDevice.addServices(HAS.predefined.TemperatureSensor(serviceNum++, capabilities));
          capabilities = [];
        }
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'target_temperature':
        if ('thermostat_mode' in device.capabilities)
        {
          variableState = HAS.predefined.TargetHeatingCoolingState(characteristicNum++,thermostatMode2targetHeatingCoolingState(device.state.thermostat_mode || 'cool') , (value, callback) =>
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
            updateStatus (device, variable, "thermostat_mode", callback);
          });
          capabilities.push(variableState);
          arrState['TargetHeatingCoolingState'] = variableState;

          variableState = HAS.predefined.CurrentHeatingCoolingState(characteristicNum++, thermostatMode2currentHeatingCoolingState(device.state.thermostat_mode || 'cool'));
          capabilities.push(variableState);
          arrState['CurrentHeatingCoolingState'] = variableState;

        }else if ('eurotronic_mode' in device.capabilities)
        {
          variableState = HAS.predefined.TargetHeatingCoolingState(characteristicNum++,eurotronicMode2targetHeatingCoolingState(device.state.eurotronic_mode || 'Energy Save Heat') , (value, callback) =>
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
            updateStatus (device, variable, "eurotronic_mode", callback);
          });
          capabilities.push(variableState);
          arrState['TargetHeatingCoolingState'] = variableState;

          variableState = HAS.predefined.CurrentHeatingCoolingState(characteristicNum++, eurotronicMode2currentHeatingCoolingState(device.state.eurotronic_mode || 'Energy Save Heat'));
          capabilities.push(variableState);
          arrState['CurrentHeatingCoolingState'] = variableState;
        }
        else
        {
          variableState = HAS.predefined.TargetHeatingCoolingState(characteristicNum++, targeTemperature2thermostatMode(device.state[key] || 20), (value, callback) =>
          {
            let variable = device.state[key];

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
          capabilities.push(variableState);
          arrState[key + 'TargetHeatingCoolingState'] = variableState;

          variableState = HAS.predefined.CurrentHeatingCoolingState(characteristicNum++, targeTemperature2currentThermostatMode(device.state[key] || 20));
          capabilities.push(variableState);
          arrState[key + 'CurrentHeatingCoolingState'] = variableState;
        }

        variableState = HAS.predefined.TargetTemperature(characteristicNum++, targetTemperature2correct(device.state[key] || 20), (value, callback) =>
        {
          let max = 28;
          if ('max' in device.capabilitiesOptions[key])
          {
            max = device.capabilitiesOptions[key].max;
          }
          value = value > max?max:value;
          updateStatus (device, value, key, callback);
          if ('measure_temperature' in device.capabilities == false)
          {
            updateStatusOnHKNoNull(value, temperature, "temperature", device);
          }
        });
        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.TemperatureDisplayUnits(characteristicNum++, 0);
        capabilities.push(variableState);

        if ('measure_temperature' in device.capabilities)
        {
          var temperature = HAS.predefined.CurrentTemperature(characteristicNum++, device.state.measure_temperature || 0);
          capabilities.push(temperature);
        }
        else
        {
          var temperature = HAS.predefined.CurrentTemperature(characteristicNum++, targetTemperature2correct(device.state[key] || 20));
          capabilities.push(temperature);
        }

        newDevice.addServices(HAS.predefined.Thermostat(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'windowcoverings_state':
        if ('dim' in device.capabilities == false)
        {
          variableState = HAS.predefined.CurrentPosition(characteristicNum++, stateCover2proc(device.state[key] || 'idle'));
          capabilities.push(variableState);
          arrState[key] = variableState;

          variableState = HAS.predefined.TargetPosition(characteristicNum++, stateCover2proc(device.state[key] || 'idle'), (value, callback) =>
          {
            let variable = 'idle';
            if (value == 100)
            {
              variable = 'up';
            }
            else if (value == 0)
            {
              variable = 'down';
            }
            updateStatus (device, variable, key, callback);
          });
          capabilities.push(variableState);
          arrState[key+'TargetPosition'] = variableState;

          variableState = HAS.predefined.PositionState(characteristicNum++, stateCover2num(device.state[key] || 'idle'));
          capabilities.push(variableState);

          newDevice.addServices(HAS.predefined.WindowCovering(serviceNum++, capabilities));
          capabilities = [];
        }
        break;

      case 'dim':
        if (device.class == 'windowcoverings')
        {
          variableState = HAS.predefined.CurrentPosition(characteristicNum++, device.state[key]*100 || 100);
          capabilities.push(variableState);
          arrState[key + 'dim'] = variableState;

          variableState = HAS.predefined.TargetPosition(characteristicNum++, device.state[key]*100 || 100, (value, callback) =>
          {
            updateStatus (device, value/100, key, callback);
          });
          capabilities.push(variableState);
          arrState[key] = variableState;

          if ('windowcoverings_state' in device.capabilities)
          {
            variableState = HAS.predefined.PositionState(characteristicNum++, stateCover2num(device.state.windowcoverings_state || 'idle'));
            capabilities.push(variableState);
          }
          else
          {
            variableState = HAS.predefined.PositionState(characteristicNum++, 2);
            capabilities.push(variableState);
          }

          newDevice.addServices(HAS.predefined.WindowCovering(serviceNum++, capabilities));
          capabilities = [];
        }
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'volume_set':
        variableState = HAS.predefined.Volume(characteristicNum++, device.state[key] * 100 || 10, (value, callback) =>
        {
          updateStatus (device, value / 100, key, callback);
        });
        capabilities.push(variableState);
        arrState[key] = variableState;

        if ('volume_mute' in device.capabilities)
        {
          variableState = HAS.predefined.Mute(characteristicNum++, device.state.volume_mute || false, (value, callback) =>
          {
            updateStatus (device, value, "volume_mute", callback);
          });
          capabilities.push(variableState);
          arrState['volume_mute'] = variableState;
        }else
        {
          variableState = HAS.predefined.Mute(characteristicNum++, device.state[key] == 0 || false, (value, callback) =>
          {
            updateStatus (device, (value ? 0: 20/100), key, callback);
          });
          capabilities.push(variableState);
          arrState[key + 'Mute'] = variableState;
        }

        newDevice.addServices(HAS.predefined.Speaker(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'vacuumcleaner_state':
        variableState = HAS.predefined.On(characteristicNum++, vacuumcleaner2state(device.state[key] || 'stopped'), (value, callback) =>
        {
          updateStatus (device, (value ? "cleaning": "docked"), key, callback);
        });
        capabilities.push(variableState);
        arrState[key] = variableState;

        variableState = HAS.predefined.OutletInUse(characteristicNum++, true);
        capabilities.push(variableState);

        newDevice.addServices(HAS.predefined.Outlet(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_generic':
        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (Button)");
        capabilities.push(variableState);

        variableState = HAS.predefined.MotionDetected(characteristicNum++, device.state[key] || false);
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.MotionSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_water':
        variableState = HAS.predefined.LeakDetected(characteristicNum++, state2num(device.state[key] || false));
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.LeakSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_smoke':
        variableState = HAS.predefined.SmokeDetected(characteristicNum++, state2num(device.state[key] || false));
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.SmokeSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_aqi':
        variableState = HAS.predefined.AirQuality(characteristicNum++, aqi2AirQualityMainlandChina(device.state[key] || 0));
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.AirQualitySensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_contact':
        variableState = HAS.predefined.ContactSensorState(characteristicNum++, state2num(device.state[key] || false));
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.ContactSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_motion':
        variableState = HAS.predefined.MotionDetected(characteristicNum++, device.state[key] || false);
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.MotionSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_humidity':
        variableState = HAS.predefined.CurrentRelativeHumidity(characteristicNum++, device.state[key] || 0.1);
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.HumiditySensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'measure_luminance':
        variableState = HAS.predefined.CurrentAmbientLightLevel(characteristicNum++, device.state[key] || 0.1);
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.LightSensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'alarm_tamper':
        variableState = HAS.predefined.OccupancyDetected(characteristicNum++, state2num(device.state[key] || false));
        capabilities.push(variableState);
        arrState[key] = variableState;

        newDevice.addServices(HAS.predefined.OccupancySensor(serviceNum++, capabilities));
        capabilities = [];
        break;

      /////NO FEADBECK
      //////////////////////////////////////////////////////////////////////////////////////////////////////////
      case 'button':
        variableState = HAS.predefined.On(characteristicNum++, false, (value, callback) =>
        {
          device.setCapabilityValue(key, value);
          callback(HAS.statusCodes.OK);
          setTimeout(setOffForButton, 100, variableState);
        });
        capabilities.push(variableState);
        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        capabilities = [];
        break;

      case 'speaker_next':
        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (next)");
        capabilities.push(variableState);

        variableState = HAS.predefined.On(characteristicNum++, false, (value, callback) =>
        {
          device.setCapabilityValue(key, value);
          callback(HAS.statusCodes.OK);
          setTimeout(setOffForButton, 100, variableState);
        });
        capabilities.push(variableState);

        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        capabilities = [];
        break;

      case 'speaker_prev':
        variableState = HAS.predefined.Name(characteristicNum++, device.name + " (Prev)");
        capabilities.push(variableState);

        variableState = HAS.predefined.On(characteristicNum++, false, (value, callback) =>
        {
          device.setCapabilityValue(key, value);
          callback(HAS.statusCodes.OK);
          setTimeout(setOffForButton, 100, variableState);
        });
        capabilities.push(variableState);

        newDevice.addServices(HAS.predefined.Switch(serviceNum++, capabilities));
        capabilities = [];
        break;

    }
  }

  console.log('State in HomeKit: ' +  JSON.stringify(arrState), "info");

  device.on('$state', state =>
  {
    console.log('Realtime event from: ' + device.name + '. Value: ' +  JSON.stringify(state), "info");

    if (device.available)
    {
      for (let key in state)
    	{
        if (key in arrState)
        {
          let variable = state[key];
          if (variable != null)
          {
            switch (device.capabilities[key].id)
            {

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'onoff':
                updateStatusOnHKNoNull((device.class == 'fan' ? state2num(variable): variable), arrState[key], key, device);
                break;

              case 'dim':
                variable = Math.floor(variable * 100);
                updateStatusOnHKNoNull(variable, arrState[key], key, device);

                if(device.class == 'windowcoverings')
                {
                  updateStatusOnHKNoNull(variable, arrState[key + 'dim'], key + 'dim', device);
                }
                break;

              case 'light_hue':
                updateStatusOnHKNoNull(Math.floor(variable * 360), arrState[key], key, device);
                break;

              case 'light_saturation':
                if ('light_hue' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(Math.floor(variable * 100), arrState[key], key, device);
                }
                break;

              case 'light_temperature':
                if ('light_hue' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(Math.floor(140 + variable * 360), arrState[key], key, device);
                }
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'locked':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'measure_co2':
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                updateStatusOnHKNoNull(co2AirQuality(variable), arrState[key+'AirQuality'], key+'AirQuality', device);

                if ('alarm_co2' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(co2CarbonDioxideDetected(variable), arrState[key+'CarbonDioxideDetected'], key+'CarbonDioxideDetected', device);
                }
                break;

              case 'alarm_co2':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'measure_battery':
                updateStatusOnHKNoNull(variable, arrState[key], key, device);

                if ('alarm_battery' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(alarmBattery(variable), arrState[key+'StatusLowBattery'], key+'StatusLowBattery', device);
                }
                break;

              case 'alarm_battery':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'speaker_playing':
                updateStatusOnHKNoNull((variable != null ? variable: false), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'measure_temperature':
                updateStatusOnHKNoNull(variable,(device.class != 'thermostat' ?arrState[key]:temperature), key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'thermostat_mode':
                updateStatusOnHKNoNull(thermostatMode2targetHeatingCoolingState(variable), arrState['targetHeatingCoolingState'], 'targetHeatingCoolingState', device);
                updateStatusOnHKNoNull(thermostatMode2currentHeatingCoolingState(variable), arrState['currentHeatingCoolingState'], 'currentHeatingCoolingState', device);
                break;

              case 'eurotronic_mode':
                updateStatusOnHKNoNull(eurotronicMode2targetHeatingCoolingState(variable), arrState['targetHeatingCoolingState'], 'targetHeatingCoolingState', device);
                updateStatusOnHKNoNull(eurotronicMode2currentHeatingCoolingState(variable), arrState['currentHeatingCoolingState'], 'currentHeatingCoolingState', device);
                break;

              case 'target_temperature':
                variable = targetTemperature2correct(variable);
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                if ('measure_temperature' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(variable, temperature,'temperature', device);
                }
                if ('thermostat_mode' in device.capabilities == false && 'eurotronic_mode' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(targeTemperature2currentThermostatMode(variable), arrState[key + 'currentHeatingCoolingState'],key + 'currentHeatingCoolingState', device);
                  updateStatusOnHKNoNull(targeTemperature2thermostatMode(variable), arrState[key + 'targetHeatingCoolingState'],key + 'targetHeatingCoolingState', device);
                }
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'windowcoverings_state':
                if ('dim' in device.capabilities == false)
                {
                  variable = stateCover2proc(variable);

                  updateStatusOnHKNoNull(variable, arrState[key], key, device);
                  updateStatusOnHKNoNull(variable, arrState[key+'TargetPosition'], key+'TargetPosition', device);
                  //updateStatusOnHKNoNull(stateCover2num(device.state.windowcoverings_state), positionState, "positionState", device);
                }
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'volume_set':
                variable = Math.floor(variable * 100);

                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                if ('volume_mute' in device.capabilities == false)
                {
                  updateStatusOnHKNoNull(variable==0, arrState[key+'Mute'], key+'Mute', device);
                }
                break;

              case 'volume_mute':
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'vacuumcleaner_state':
                updateStatusOnHKNoNull(vacuumcleaner2state(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'alarm_generic':
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'alarm_water':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'alarm_smoke':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'measure_aqi':
                updateStatusOnHKNoNull(aqi2AirQualityMainlandChina(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'alarm_contact':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'alarm_motion':
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'measure_humidity':
                updateStatusOnHKNoNull(variable, arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'measure_luminance':
                updateStatusOnHKNoNull((variable == 0 ? 0.1: variable), arrState[key], key, device);
                break;

              //////////////////////////////////////////////////////////////////////////////////////////////////////////
              case 'alarm_tamper':
                updateStatusOnHKNoNull(state2num(variable), arrState[key], key, device);
                break;

            }
          }
        }
      }
    }else
    {
      console.log(device.name + ': not available ', 'error');
    }
  });


  return newDevice;

}


module.exports = {
  configServer: configServer,
  createDevice: createDevice
}
