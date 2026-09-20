'use strict'

const Homey = require('homey')

module.exports = class BigLEDCandlesDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.colorChangedTrigger = this.homey.flow.getDeviceTriggerCard('color-changed')

    this.homey.flow
      .getConditionCard('color-is')
      .registerRunListener(async ({ device, color }) => {
        return device.getCapabilityValue('candle-color') === color
      })

    this.homey.flow
      .getActionCard('set-color')
      .registerRunListener(async ({ device, color }) => {
        await device.setColor(color)
      })

    this.homey.flow
      .getActionCard('next-mode')
      .registerRunListener(async ({ device }) => {
        await device.nextMode()
      })

    this.homey.flow
      .getActionCard('timer')
      .registerRunListener(async ({ device, duration }) => {
        await device.setTimer(duration)
      })
  }

  async triggerColorChanged(device, color) {
    await this.colorChangedTrigger.trigger(device, { color })
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    return [
      {
        name: this.homey.__('big_led_candle_name'),
        data: {
          id: 'big-led-candles',
        },
      },
    ]
  }
}
