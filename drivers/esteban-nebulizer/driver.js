'use strict'

const Homey = require('homey')

module.exports = class EstebanNebulizerDriver extends Homey.Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.homey.flow
      .getActionCard('toggle-light')
      .registerRunListener(async ({ device }) => {
        await device.toggleLight()
      })

    this.homey.flow
      .getActionCard('next-brightness')
      .registerRunListener(async ({ device }) => {
        await device.nextBrightness()
      })

    this.homey.flow
      .getActionCard('next-mist-mode')
      .registerRunListener(async ({ device }) => {
        await device.nextMistMode()
      })

    this.homey.flow
      .getActionCard('press-button')
      .registerRunListener(async ({ device, button }) => {
        await device.sendCmd(button)
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
        name: this.homey.__('esteban_nebulizer_name'),
        data: {
          id: 'esteban-nebulizer',
        },
      },
    ]
  }
}
