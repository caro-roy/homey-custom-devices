'use strict'

const Homey = require('homey')

module.exports = class MyDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.homey.flow
      .getActionCard('luminosity')
      .registerRunListener(async ({ device, direction }) => {
        await device.sendCmd(direction === 'up' ? 'LUM_UP' : 'LUM_DOWN')
      })

    this.homey.flow
      .getActionCard('light-mode')
      .registerRunListener(async ({ device, mode }) => {
        await device.setLightMode(mode)
      })
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    return [
      {
        name: this.homey.__('small_led_candle_name'),
        data: {
          id: 'small-led-candles',
        },
      },
    ]
  }
}
