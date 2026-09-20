'use strict'

const Homey = require('homey')

module.exports = class SmallLEDCandles extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.signal = this.homey.rf.getSignalInfrared('small-led-candles')

    this.registerCapabilityListener('onoff', async value => {
      await this.sendCmd(value ? 'ON' : 'OFF')
    })

    this.registerCapabilityListener('button.lum_down', async () => {
      await this.sendCmd('LUM_DOWN')
    })

    this.registerCapabilityListener('button.lum_up', async () => {
      await this.sendCmd('LUM_UP')
    })

    this.registerCapabilityListener('light-mode', async value => {
      await this.sendCmd(`MODE_${value}`.toUpperCase())
    })
  }

  /**
   * Sends the mode command and keeps the capability value in sync,
   * so the tile reflects modes set from a Flow.
   */
  async setLightMode(mode) {
    await this.setCapabilityValue('light-mode', mode)
    await this.sendCmd(`MODE_${mode}`.toUpperCase())
  }

  async sendCmd(cmd) {
    await this.signal.cmd(cmd)
  }
}
