'use strict'

const Homey = require('homey')
const { nearestColor, getColor } = require('./colors')

module.exports = class BigLEDCandles extends Homey.Device {
  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.signal = this.homey.rf.getSignalInfrared('big-led-candles')

    this.registerCapabilityListener('onoff', async value => {
      await this.sendCmd(value ? 'ON' : 'OFF')
    })

    this.registerCapabilityListener('button.mode', async () => {
      await this.nextMode()
    })

    this.registerCapabilityListener('candle-color', async value => {
      await this.applyColor(value)
    })

    /**
     * The native color wheel is continuous while the remote only has 12 fixed
     * colors, so the picked hue/saturation is snapped onto the closest one.
     * Both capabilities are handled together because Homey sets them in pairs.
     */
    this.registerMultipleCapabilityListener(
      ['light_hue', 'light_saturation'],
      async values => {
        const hue = values.light_hue ?? this.getCapabilityValue('light_hue') ?? 0
        const saturation =
          values.light_saturation ?? this.getCapabilityValue('light_saturation') ?? 1

        const color = nearestColor(hue, saturation)
        await this.setCapabilityValue('candle-color', color.id)
        await this.applyColor(color.id)
      },
      500,
    )
  }

  /**
   * The remote only exposes a single "mode" button cycling through the modes,
   * so there is no known state to keep in sync.
   */
  async nextMode() {
    await this.sendCmd('MODE')
  }

  /**
   * Sends the color command and keeps the capability value in sync,
   * so the tile reflects colors set from a Flow or from the widget.
   */
  async setColor(color) {
    await this.setCapabilityValue('candle-color', color)
    await this.applyColor(color)
  }

  /**
   * Sends the color, snaps the color wheel onto it and notifies the listeners.
   */
  async applyColor(color) {
    await this.sendCmd(color)
    await this.syncColorWheel(color)
    await this.driver.triggerColorChanged(this, color)
    await this.homey.api.realtime('candle-color', { color })
  }

  /**
   * Moves the native color wheel onto the color that is actually lit.
   * The multicolor cycle has no single hue, so the wheel is left untouched.
   */
  async syncColorWheel(colorId) {
    const color = getColor(colorId)
    if (!color) return

    await this.setCapabilityValue('light_hue', color.hue)
    await this.setCapabilityValue('light_saturation', color.saturation)
  }

  async setTimer(duration) {
    await this.sendCmd(`TIMER_${duration}`)
  }

  async sendCmd(cmd) {
    await this.signal.cmd(cmd)
  }
}
