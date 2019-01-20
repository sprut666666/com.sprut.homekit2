'use strict';
const Homey = require('homey')

module.exports = [

  {
    method: 'GET',
    path: '/devices',
    fn: function(args, callback)
    {
      Homey.app.getDevices().then(res =>
        {
          callback(null, res);
        })
        .catch(error => callback(error, null));
    }
  },
  {
    method: 'GET',
    path: '/log',
    fn: function(args, callback)
    {
      callback(null, Homey.app.getLog());
    }
  },
  {
    method: 'PUT',
    path: '/devices/add',
    fn: function(args, callback)
    {
      Homey.app.addDevice(args.body.id,undefined,true,true).then(res =>
        {
          callback(null, true);
        })
        .catch(error => callback(error, null));
    }
  },
  {
    method: 'PUT',
    path: '/devices/addUngrouped',
    fn: function(args, callback)
    {
      Homey.app.addDevice(args.body.id,undefined,false,true).then(res =>
        {
          callback(null, true);
        })
        .catch(error => callback(error, null));
    }
  },
  {
    method: 'PUT',
    path: '/devices/delete',
    fn: function(args, callback)
    {
      Homey.app.deleteDevice(args.body.id,undefined).then(res =>
        {
          callback(null, true);
        })
        .catch(error => {
          console.log(err, 'error')
          callback(error, null);
        });
    }
  }
]
