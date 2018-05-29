# HomeKit for Homey

![Image of paircode](https://github.com/sprut666666/graphics/blob/master/homekit/code.png)

After Homey is paired, go to "settings" -> "HomeKit". There select the devices you want to pair with "HomeKit" and wait =)
Example of work: https://www.youtube.com/watch?v=yZWt6jDCl7E (New video from Homey the work)

Remote access in HomeKit: https://support.apple.com/en-us/HT207057

If you have problems update your "I" device & Apple TV. On iOS 11 everything works perfectly. If you don't see for example the "SPEAKER" look here https://itunes.apple.com/us/app/elgato-eve/id917695792?mt=8

If the problem remained fully describe the situation. If you found any bugs, any other feature you can create an issue on [com.sprut.homekit](https://github.com/sprut666666/com.sprut.homekit)

You can add any device and if it supported device types they will be added to HomeKit. If the device is not supported device types will be added to the device "NOT SUPPORTED" - If you want I added a new device type send me "full info:" the device from the log on sprut666666@gmail.com

Now supports the types:
- Light (On-off, dim, Temperature control, RGB)
- Fan
- Switch
- Outlet
- Door-lock
- Curtains
- Motion sensor
- Humidity sensor
- Light sensor
- Carbon dioxide sensor
- Temperature sensor
- Leak sensor
- Smoke sensor
- Contact sensor (door/window sensor)
- AirQuality sensor
- Thermostat
- Volume speaker
- Vacuum cleaner
- Button (simple and Play/Pause etc)
- Doorbell button (as Motion sensor)
- Home Alarm

+ Battery service for all

---

### About
Many thanks to the developer who wrote the library [has-node](https://github.com/abedinpour/HAS) Without which the application cannot run ;)
Many thanks [abedinpour](https://github.com/abedinpour) so much for the work done.

The basis of this application is taken development [com.swttt.homekit](https://github.com/swttt/com.swttt.homekit)
Many thanks [Swttt](https://github.com/swttt) so much for the work done.

And I [Sprut](https://github.com/sprut666666) - engaged in ongoing app development =)

---

### Changelog

#### 2.5.6
- downgrade athom-api@2.0.108

#### 2.5.5
- update athom-api@2.0.116
- fix RGBW
- fix name for HomeKit (Room + " " + Name device)

#### 2.5.4
- update athom-api@2.0.108

#### 2.5.3
- update athom-api@2.0.106

#### 2.5.2
- update athom-api@2.0.105

#### 2.5.1
- update athom-api@2.0.99
- critical fix

#### 2.5.0
- update new-types-for-homekit@1.0.1
- Add Ultraviolet Sensor
- Add Noise Level Sensor
- Add Atmospheric Pressure Sensor

#### 2.4.7
- update athom-api@2.0.96
- new lib new-types-for-homekit@1.0.0

#### 2.4.6
- update athom-api@2.0.93
- new optimization for HomeCenter

#### 2.4.5
- update has-node@0.4.13
- update athom-api@2.0.94
- Add consumption in Watts
- Add total consumption in kWh

#### 2.4.2
- Add support Home Alarm

#### 2.4.1
- Fix status door-lock
- Add device 'name' + 'room'
- Add support class 'car_alarm'

#### 2.4.0
- update has-node@0.4.11
- update athom-api@2.0.93
- Now you can add 150 devices
- Memory optimization

#### 2.3.5
- update has-node@0.4.9
- critical fixes

#### 2.3.4
- update has-node@0.4.8
- Optimization and improvements

#### 2.3.3
- Now the humidity&temperature accuracy is up to 0.01

#### 2.3.2
- update has-node@0.4.6
- update athom-api@2.0.92
- little fix

#### 2.3.1
- Now the humidity accuracy is up to 0.1

#### 2.3.0
- many many many many stability =)
- update has-node@0.4.5
- fix add&delate

#### 2.2.4
- update athom-api@2.0.91
- update has-node@0.4.0
- Little fixes for delete device

#### 2.2.3
- update athom-api@2.0.88
- Little fixes for virtual device

#### 2.2.2
- update has-node@0.3.4

#### 2.2.1
- Little fixes

#### 2.2.0
- Improving stability and fixes

#### 2.1.8
- fix thermostat_mode
- fix fast add/delete
- checking for incorrect values

#### 2.1.7
- now lux can be equal to 0
- now temperature can be equal to -100
- now target temperature synch min & max value

#### 2.1.6
- update has-node@0.3.3

#### 2.1.5
- update athom-api@2.0.72

#### 2.1.4
- update has-node@0.3.1
- update athom-api@2.0.71
- fix delete device

#### 2.1.3
- update has-node@0.2.8

#### 2.1.2
- update athom-api@2.0.62
- update has-node@0.2.7

#### 2.1.1
- update athom-api@2.0.61
- update has-node@0.2.6

#### 2.1.0
- update athom-api@2.0.52
- new configuration storage structure
- many fix & stability

#### 2.0.7
- update athom-api@2.0.50
- add delate unGroup

#### 2.0.6
- update athom-api@2.0.35

#### 2.0.5
- fix & 2 step ungroup device

#### 2.0.4
- fix & 1 step ungroup device

#### 2.0.3
- update athom-api@2.0.34

#### 2.0.2
- update has-node@0.2.5

#### 2.0.0
- Big update (new logic for find devices)
- Support MySensors + etc not standart plugins

#### 1.1.9
- Fix README

#### 1.1.8
- Fix info & README

#### 1.1.7
- If wakeup interval > 15 seconds - no online state

#### 1.1.6
- Extended support for status updates of devices

#### 1.1.5
- Verification of successful installation of the new parameters in Homey
- Fix for MiLight

#### 1.1.4
- Small fixes

#### 1.1.3
- Critical bugfix when adding many devices

#### 1.1.2
- update has-node@0.2.3

#### 1.1.1
- fix WindowCovering

#### 1.1.0
- update has-node@0.2.2
- new ColorTemperature
- fix RGBW

#### 1.0.5
- fix bugs in Thermostat & expansion of functionality

#### 1.0.4
- fix Thermostat not measure_temperature

#### 1.0.3
- Add Doorbell button (as Motion sensor)

#### 1.0.2
- Add full device info for debug

#### 1.0.1
- Support 2 bridges for example com.swttt.homekit

#### 1.0.0
- Initial release
