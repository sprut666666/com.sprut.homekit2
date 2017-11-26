"use strict";

const debug = true;
const fs = require('fs');

// Enable TCP debug
// process.env.DEBUG = 'TCP';

const Homey = require('homey')
const { HomeyAPI } = require('athom-api')
const Homekit = require('./lib/homekit.js')

let server = {},
    log = [];

if (debug)
{
  console.log = function(string, type)
  {
    let d = new Date();
    let n = d.toLocaleTimeString();
    let item = {};
    item.time = n;
    item.string = string;
    item.type = type;
    log.push(item);
    Homey.ManagerApi.realtime('log.new', log)
      .catch( this.error )
    if(log.length > 50)
    {
      log.splice(0,1);
    }
  };
}


class HomekitApp extends Homey.App
{
  // Get homey object
  getApi()
  {
    if (!this.api) this.api = HomeyAPI.forCurrentHomey();
    return this.api;
  }

  async getDevices()
  {
    let api = await this.getApi();
    return await api.devices.getDevices();
  }

  getLog()
  {
    return log;
  }

  async initOldStruct(newPairedDevices)
  {
    let allPairedDevices = await Homey.ManagerSettings.get('pairedDevices') || [];
    let allPairedDevicesUngrouped = await Homey.ManagerSettings.get('pairedDevicesUngrouped') || [];

    if (allPairedDevices.length > 0)
    {
      for (let i = 0; i < allPairedDevices.length; i++)
      {
        let device = allPairedDevices[i];

        newPairedDevices[device.id] = {};
        newPairedDevices[device.id].group = true;
        newPairedDevices[device.id].accessory = false;
        newPairedDevices[device.id].pairedСlass = device.class;
        newPairedDevices[device.id].pairedCapabilities = {};
        newPairedDevices[device.id].homeKitIDs = {};

        for (let capabilitie in device.capabilities)
        {
          newPairedDevices[device.id].pairedCapabilities[capabilitie] = device.capabilities[capabilitie].id;
        }
      }

      Homey.ManagerSettings.set('pairedDevices', [], (err, result) =>
      {
        if (err) return Homey.alert(err);
      });
    }

    if (allPairedDevicesUngrouped.length > 0)
    {
      for (let i = 0; i < allPairedDevicesUngrouped.length; i++)
      {
        let device = allPairedDevicesUngrouped[i];

        newPairedDevices[device.id] = {};
        newPairedDevices[device.id].group = false;
        newPairedDevices[device.id].accessory = false;
        newPairedDevices[device.id].pairedСlass = device.class;
        newPairedDevices[device.id].pairedCapabilities = {};
        newPairedDevices[device.id].homeKitIDs = {};

        for (let capabilitie in device.capabilities)
        {
          newPairedDevices[device.id].pairedCapabilities[capabilitie] = device.capabilities[capabilitie].id;
        }
      }

      Homey.ManagerSettings.set('pairedDevicesUngrouped', [], (err, result) =>
      {
        if (err) return Homey.alert(err);
      });
    }
  }

  // Start server function
  async startingServer()
  {
    // Get the homey object
    let api = await this.getApi();
    // Get system info
    let systeminfo = await api.system.getInfo();
    // Subscribe to realtime events and set all devices global
    await api.devices.subscribe();

    server = await Homekit.configServer(systeminfo);

    let newPairedDevices = await Homey.ManagerSettings.get('newPairedDevices') || {};
    await this.initOldStruct(newPairedDevices);

    let deviceForDel = [];
    let allDevices = await this.getDevices();
    for (let device in newPairedDevices)
    {
      if (device in allDevices)
      {
        console.log(device + ' - device found.', 'info');
        let checkDevice = allDevices[device];
        let pairedDevice = newPairedDevices[device];
        let addDevice = true;

        if (checkDevice.class != pairedDevice.pairedСlass)
        {
          console.log(device + ' - class change.', 'info');
          deviceForDel.push(device);
          addDevice = false;
        }
        else
        {
          for (let capabilitie in pairedDevice.pairedCapabilities)
          {
            if (capabilitie in checkDevice.capabilities)
            {
              if (checkDevice.capabilities[capabilitie].id != pairedDevice.pairedCapabilities[capabilitie])
              {
                console.log(device + ' - capabilitie ID change.', 'info');
                deviceForDel.push(device);
                addDevice = false;
              }
            }else
            {
              console.log(device + ' - capabilitie change.', 'info');
              deviceForDel.push(device);
              addDevice = false;
            }
          }

          for (let capabilitie in checkDevice.capabilities)
          {
            if (capabilitie in pairedDevice.pairedCapabilities == false)
            {
              console.log(device + ' - capabilitie change.', 'info');
              deviceForDel.push(device);
              addDevice = false;
            }
          }
        }

        if (addDevice)
        {
          await this.addDevice(device, allDevices, newPairedDevices[device].group, newPairedDevices);
        }
      }
      else
      {
        console.log(device + ' - device not found.', 'info');
        deviceForDel.push(device);
      }
    }

    if (deviceForDel.length)
    {
      for (let i = 0; i < deviceForDel.length; i++)
      {
        delete newPairedDevices[deviceForDel[i]];
      }
    }

    await Homey.ManagerSettings.set('newPairedDevices', newPairedDevices, (err, result) =>
    {
      if (err) return Homey.alert(err);
    });

    console.log(newPairedDevices, 'success');
    // Start the server
    server.startServer();
    console.log('Homekit server started.', 'success');

    console.log('homey.json = ' + fs.readFileSync('../userdata/homey.json', "utf8") , 'success');

    api.devices.on('device.delete', deviceID =>
    {
      let newPairedDevices = Homey.ManagerSettings.get('newPairedDevices') || {};

      if (deviceID in newPairedDevices)
      {
        this.deleteDevice(deviceID, false);
      }
    });

  }

  async onInit()
  {
    // Start the server
    await this.startingServer()
      .then(console.log('Homekit server starting!', 'info'))
      .catch(this.error);
  }



  async addDevice(device, allDevices, unGroup, newPairedDevices)
  {
    console.log(device + ' is start added!', 'success');
    if (allDevices === undefined) allDevices = await this.getDevices();
    if (newPairedDevices === undefined)
    {
      newPairedDevices = await Homey.ManagerSettings.get('newPairedDevices') || {};
      await Homekit.createDevice(allDevices[device], server, unGroup, newPairedDevices);

      await Homey.ManagerSettings.set('newPairedDevices', newPairedDevices, (err, result) =>
      {
        if (err) return Homey.alert(err);
      });
    } else
    {
      await Homekit.createDevice(allDevices[device], server, unGroup, newPairedDevices);
    }
    console.log(device + ' is added!', 'success');
  }


  async deleteDevice(device, deviceExist)
  {
    console.log('Trying to remove device ' + device, "info");

    if (deviceExist === undefined)
    {
      let allDevices = await this.getDevices();
      await allDevices[device].removeAllListeners('$state');
    }

    //console.log('homey.json = ' + fs.readFileSync('../userdata/homey.json', "utf8") , 'success');

    let newPairedDevices = await Homey.ManagerSettings.get('newPairedDevices') || {};
    for (let ID in newPairedDevices[device].homeKitIDs)
    {
      await server.removeAccessory(ID);
      await server.config.resetHASID(newPairedDevices[device].homeKitIDs[ID]);
      //console.log('ID remove in HomeKit ' + ID, "info");
      //console.log('UUID remove in HomeKit ' + newPairedDevices[device].homeKitIDs[ID], "info");
    }
    //console.log('homey.json = ' + fs.readFileSync('../userdata/homey.json', "utf8") , 'success');

    delete newPairedDevices[device];

    await Homey.ManagerSettings.set('newPairedDevices', newPairedDevices, (err, result) =>
    {
      if (err) return Homey.alert(err);
    });

    console.log(device + ' is removed!', 'success');

  }

}

module.exports = HomekitApp
