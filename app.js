

const debug = true

// Enable TCP debug
// process.env.DEBUG = 'TCP';

const Homey = require('homey')
const { HomeyAPI } = require('athom-api')
const Homekit = require('./lib/homekit.js')


let allDevices = {}
let allPairedDevices = []
let allPairedDevicesUngrouped = []
let server = {}
const log = []

if (debug) {
  console.log = (string, type) => {
    const d = new Date()
    const n = d.toLocaleTimeString()
    const item = {}
    item.time = n
    item.string = string
    item.type = type
    log.push(item)
    Homey.ManagerApi.realtime('log.new', log)
      .catch(this.error)
    if (log.length > 50) {
      log.splice(0, 1)
    }
  }
}


class HomekitApp extends Homey.App {
  // Get homey object
  getApi() {
    if (!this.api) {
      this.api = HomeyAPI.forCurrentHomey()
    }
    return this.api
  }

  async getDevices() {
    const api = await this.getApi()
    allDevices = await api.devices.getDevices()
    return allDevices
  }

  // eslint-disable-next-line class-methods-use-this
  getLog() {
    return log
  }

  async initAllDevice(devicesForInit, namePairedDevices, unGroup) {
    const deviceForDel = []

    for (let i = 0; i < devicesForInit.length; i++) {
      // If device has the class light
      const device = devicesForInit[i]

      if (device.id in allDevices) {
        console.log(`${device.name} - device found.`, 'info')
        if (unGroup === undefined) {
          await this.addDevice(device, true)
        } else {
          await this.addDevice(device, true, true)
        }
      } else {
        console.log(`${device.name} - device not found.`, 'info')
        deviceForDel.push(device)
      }
    }

    if (deviceForDel.length) {
      for (let i = 0; i < deviceForDel.length; i += 1) {
        const device = deviceForDel[i]

        for (let z = 0; z < devicesForInit.length; z += 1) {
          if (devicesForInit[z] && devicesForInit[z].id === device.id) {
            devicesForInit.splice(z, 1)
            break
          }
        }
      }

      await Homey.ManagerSettings.set(namePairedDevices, devicesForInit, (err, result) => {
        if (err) {
          return Homey.alert(err)
        }
      })

      console.log(`Delete paired devices! => ${deviceForDel.length}`, 'success')
    }
  }

  // Start server function
  async startingServer() {
    // Get the homey object
    const api = await this.getApi()
    // Get system info
    const systeminfo = await api.system.getInfo()
    // Subscribe to realtime events and set all devices global
    await api.devices.subscribe()
    allDevices = await api.devices.getDevices()

    server = await Homekit.configServer(systeminfo)

    // Loop all devices
    allPairedDevices = await Homey.ManagerSettings.get('pairedDevices') || []
    await this.initAllDevice(allPairedDevices, 'pairedDevices')

    allPairedDevicesUngrouped = await Homey.ManagerSettings.get('pairedDevicesUngrouped') || []
    await this.initAllDevice(allPairedDevicesUngrouped, 'pairedDevicesUngrouped', true)


    if (allPairedDevices.length || allPairedDevicesUngrouped.length) {
      await console.log('Added all devices..done here!', 'success')
    } else {
      await console.log('No devices found...', 'info')
    }

    // Start the server
    server.startServer()

    console.log('Homekit server started.', 'success')

    api.devices.on('device.delete', (deviceID) => {
      allPairedDevices = Homey.ManagerSettings.get('pairedDevices') || []

      let deletePairedDevices = false

      for (let i = 0; i < allPairedDevices.length; i++) {
        if (allPairedDevices[i] && allPairedDevices[i].id === deviceID) {
          allPairedDevices.splice(i, 1)
          deletePairedDevices = true
          break
        }
      }

      if (deletePairedDevices) {
        server.removeAccessory(server.config.getHASID(deviceID))

        Homey.ManagerSettings.set('pairedDevices', allPairedDevices, (err, result) => {
          if (err) {
            return Homey.alert(err)
          }
        })

        console.log(`Delete device! => ${deviceID}`, 'success')
      }
    })
  }

  async onInit() {
    // Start the server
    await this.startingServer()
      .then(console.log('Homekit server starting!', 'info'))
      .catch(this.error)
  }


  async addDevice(device, noCheck, unGroup) {
    if (noCheck === undefined) {
      await this.getDevices()
      console.log(`${device.name} getDevices() `, 'info')
    }

    console.log(`${device.name} class: ${allDevices[device.id].class}`, 'info')

    if (unGroup === true) {
      await Homekit.createDevice(allDevices[device.id], server, true)
    } else {
      await Homekit.createDevice(allDevices[device.id], server)
    }

    console.log(`${device.name} is added!`, 'success')
  }

  // eslint-disable-next-line class-methods-use-this
  async deleteDevice(device, unGroup) {
    console.log(`Trying to remove device ${device.id}`, 'info')

    allDevices[device.id].removeAllListeners('$state')

    if (unGroup) {
      for (const key in device.capabilities) { // eslint-disable-line guard-for-in, no-restricted-syntax
        switch (device.capabilities[key].id) { // eslint-disable-line default-case
          case 'onoff':
          case 'locked':
          case 'measure_co2':
          case 'measure_battery':
          case 'speaker_playing':
          case 'target_temperature':
          case 'volume_set':
          case 'vacuumcleaner_state':
          case 'alarm_generic':
          case 'alarm_water':
          case 'alarm_smoke':
          case 'measure_aqi':
          case 'alarm_contact':
          case 'alarm_motion':
          case 'measure_humidity':
          case 'measure_luminance':
          case 'alarm_tamper':
          case 'button':
          case 'speaker_next':
          case 'speaker_prev':
            server.removeAccessory(server.config.getHASID(device.id + key))
            break
          case 'measure_temperature':
            if (device.class !== 'thermostat') {
              server.removeAccessory(server.config.getHASID(device.id + key))
            }
            break
          case 'windowcoverings_state':
            if ('dim' in device.capabilities === false) {
              server.removeAccessory(server.config.getHASID(device.id + key))
            }
            break
          case 'dim':
            if (device.class === 'windowcoverings') {
              server.removeAccessory(server.config.getHASID(device.id + key))
            }
            break
        }
      }
    } else {
      server.removeAccessory(server.config.getHASID(device.id))
    }

    console.log(`${device.name} is removed!`, 'success')
  }
}

module.exports = HomekitApp
