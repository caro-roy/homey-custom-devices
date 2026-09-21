'use strict'

const Homey = require('homey')

module.exports = class EstebanNebulizer extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.signal = this.homey.rf.getSignalInfrared('esteban-nebulizer')

    this.registerCapabilityListener('onoff', async () => {
      await this.sendCmd('POWER')
    })

    this.registerCapabilityListener('button.light', async () => {
      await this.toggleLight()
    })

    this.registerCapabilityListener('button.brightness', async () => {
      await this.nextBrightness()
    })

    this.registerCapabilityListener('button.mist_mode', async () => {
      await this.nextMistMode()
    })
  }

  /**
   * The remote only exposes toggling/cycling buttons, so there is no known
   * state to keep in sync: each one simply replays its own command.
   */
  async toggleLight() {
    await this.sendCmd('LIGHT')
  }

  async nextBrightness() {
    await this.sendCmd('BRIGHTNESS')
  }

  async nextMistMode() {
    await this.sendCmd('MIST_MODE')
  }

  async sendCmd(cmd) {
    await this.signal.cmd(cmd)
  }
}
