'use strict'

const DRIVER_ID = 'big-led-candles'

/**
 * `Homey.getDeviceIds()` returns Homey's internal device ids, which are not
 * exposed through a public getter on Device. Fall back to the only paired
 * device when no id matches, since the driver pairs a single device.
 */
function getDevice(homey, deviceId) {
  const devices = homey.drivers.getDriver(DRIVER_ID).getDevices()
  const device = devices.find(d => (d.__id ?? d.id) === deviceId)

  if (device) return device
  if (devices.length === 1) return devices[0]

  throw new Error('Device not found')
}

module.exports = {
  async getState({ homey, query }) {
    const device = getDevice(homey, query.deviceId)

    return {
      color: device.getCapabilityValue('candle-color'),
      onoff: device.getCapabilityValue('onoff'),
    }
  },

  async setColor({ homey, body }) {
    const device = getDevice(homey, body.deviceId)
    await device.setColor(body.color)

    return { color: body.color }
  },
}
