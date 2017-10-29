
const Homey = require('homey')

module.exports = [
  {
    method: 'GET',
    path: '/devices',
    fn(args, callback) {
      Homey.app.getDevices().then((res) => {
        callback(null, res)
      })
        .catch(error => callback(error, null))
    },
  },
  {
    method: 'GET',
    path: '/log',
    fn(args, callback) {
      callback(null, Homey.app.getLog())
    },
  },
  {
    method: 'PUT',
    path: '/devices/add',
    fn(args, callback) {
      Homey.app.addDevice(args.body).then((res) => {
        callback(null, true)
      })
        .catch(error => callback(error, null))
    },
  },
  {
    method: 'PUT',
    path: '/devices/addUngrouped',
    fn(args, callback) {
      Homey.app.addDevice(args.body, undefined, true).then((res) => {
        callback(null, true)
      })
        .catch(error => callback(error, null))
    },
  },
  {
    method: 'DELETE',
    path: '/devices/delete',
    fn(args, callback) {
      console.log(`API call received, trying to remove ${args.body.name}`, 'info')
      Homey.app.deleteDevice(args.body).then((res) => {
        callback(null, true)
      })
        .catch((error) => {
          console.log(error, 'error')
          callback(error, null)
        })
    },
  },
  {
    method: 'DELETE',
    path: '/devices/deleteUngrouped',
    fn(args, callback) {
      console.log(`API call received, trying to remove ${args.body.name}`, 'info')
      Homey.app.deleteDevice(args.body, true).then((res) => {
        callback(null, true)
      })
        .catch((error) => {
          console.log(error, 'error')
          callback(error, null)
        })
    },
  },
]
