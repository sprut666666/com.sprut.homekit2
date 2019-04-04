"use strict";

const debug = true;
const fs = require('fs');
const delay          = ms => new Promise(resolve => setTimeout(resolve, ms));

// Enable TCP debug
// process.env.DEBUG = 'TCP';

const Homey = require('homey')
const { HomeyAPI } = require('athom-api')
const Homekit = require('./lib/homekit.js')

var server = {};
var newPairedDevices = {};
let log = [];

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

  // Start server function
  async startingServer()
  {
    // Get the homey object
    let api = await this.getApi();
    // Get system info
    let systeminfo = await api.system.getInfo();
    // Subscribe to realtime events and set all devices global
    //await api.devices.subscribe();

    server = await Homekit.configServer(systeminfo);

    newPairedDevices = await Homey.ManagerSettings.get('newPairedDevices') || {};

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
            if (capabilitie in checkDevice.capabilitiesObj)
            {
              if (checkDevice.capabilitiesObj[capabilitie].id != pairedDevice.pairedCapabilities[capabilitie])
              {
                console.log(device + ' - capabilitie ID change.', 'info');
                deviceForDel.push(device);
                addDevice = false;
                break;
              }
            }else
            {
              console.log(device + ' - capabilitie change.', 'info');
              deviceForDel.push(device);
              addDevice = false;
              break;
            }
          }

          for (let capabilitie in checkDevice.capabilitiesObj)
          {
            if (capabilitie in pairedDevice.pairedCapabilities == false)
            {
              console.log(device + ' - capabilitie change.', 'info');
              deviceForDel.push(device);
              addDevice = false;
              break;
            }
          }
        }

        if (addDevice)
        {
          await this.addDevice(device, allDevices, newPairedDevices[device].group);
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
        for (let ID in newPairedDevices[deviceForDel[i]].homeKitIDs){
          await server.config.resetHASID(newPairedDevices[deviceForDel[i]].homeKitIDs[ID]);
        }
        console.log(deviceForDel[i] + ' is removed!', 'success');
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
      this.deleteDevice(deviceID, false);
    });

  }

  async onInit()
  {

    this.api = await this.getApi();
    this.pairedDevices = {};

    let uptime     = (await this.api.system.getInfo()).uptime;

    if (uptime < 1200)
    {
      console.log('Homey rebooted, waiting for devices to settle');

      let previousDeviceCount = 0;

      while (true) {

        let newDeviceCount = Object.keys(await this.getDevices()).length;

        if (newDeviceCount && newDeviceCount === previousDeviceCount) break;

        previousDeviceCount = newDeviceCount;

        await delay(60 * 1000);
      }
    }

    // Start the server
    await this.startingServer()
      .then(console.log('Homekit server starting!', 'info'))
      .catch(this.error);
  }



  async addDevice(device, allDevices, group, newDevice)
  {

    if (allDevices === undefined) allDevices = await this.getDevices();

    if (newDevice === undefined)
    {
      console.log(device + ' is start added!', 'success');
      await Homekit.createDevice(allDevices[device], server, group, newPairedDevices);
      console.log(device + ' is added!', 'success');
    }
    else
    {
      if (device in newPairedDevices == false)
      {
        console.log(device + ' is start added!', 'success');

        newPairedDevices[device] = {};
        newPairedDevices[device].group = group;
        newPairedDevices[device].accessory = false;
        newPairedDevices[device].pairedСlass = allDevices[device].class;
        newPairedDevices[device].pairedCapabilities = {};
        newPairedDevices[device].homeKitIDs = {};

        for (let capabilitie in allDevices[device].capabilitiesObj)
        {
          newPairedDevices[device].pairedCapabilities[capabilitie] = allDevices[device].capabilitiesObj[capabilitie].id;
        }

        await Homekit.createDevice(allDevices[device], server, group, newPairedDevices);

        await Homey.ManagerSettings.set('newPairedDevices', newPairedDevices, (err, result) =>
        {
          if (err) return Homey.alert(err);
        });

        console.log(device + ' is added!', 'success');
      }
    }

    //console.log('homey.json = ' + fs.readFileSync('../userdata/homey.json', "utf8") , 'success');
  }


  async deleteDevice(device, deviceExist)
  {
    if (device in newPairedDevices)
    {
      console.log('Trying to remove device ' + device, "info");

      if (deviceExist === undefined)
      {
        let allDevices = await this.getDevices();
        await allDevices[device].removeAllListeners('$state');
      }

      for (let ID in newPairedDevices[device].homeKitIDs)
      {
        await server.removeAccessory(ID);
        await server.config.resetHASID(newPairedDevices[device].homeKitIDs[ID]);
        console.log('ID remove in HomeKit ' + ID, "info");
        console.log('UUID remove in HomeKit ' + newPairedDevices[device].homeKitIDs[ID], "info");
      }

      delete newPairedDevices[device];

      await Homey.ManagerSettings.set('newPairedDevices', newPairedDevices, (err, result) =>
      {
        if (err) return Homey.alert(err);
      });

      console.log(device + ' is removed!', 'success');
      //console.log('homey.json = ' + fs.readFileSync('../userdata/homey.json', "utf8") , 'success');
    }
  }

}

module.exports = HomekitApp
