import { defaultState, DualShock4Interface } from './state'
import DualShock4Lightbar from './lightbar'
import DualShock4Rumble from './rumble'
import { normalizeThumbstick, normalizeTrigger } from './util/normalize'
import { crc32 } from 'crc'

export class DualShock4 {
  device ?: webhid.HIDDevice

  lastReport ?: ArrayBuffer
  lastSentReport ?: ArrayBuffer

  state = defaultState

  lightbar = new DualShock4Lightbar(this)
  rumble = new DualShock4Rumble(this)

  /**
   * Initializes the WebHID API 
   */
  async init () {
    if (this.device && this.device.opened) return

    this.device = await navigator.hid.requestDevice({
      filters: [
        // TODO: Add more IDs
        { vendorId: 0x054C, productId: 0x09CC }
      ]
    })

    await this.device.open()

    this.device.oninputreport = (e : webhid.HIDInputReportEvent) => this.processControllerReport(e)
  }

  processControllerReport (report : webhid.HIDInputReportEvent) {
    const { data } = report
    this.lastReport = data.buffer

    // Interface is unknown
    if (this.state.interface === DualShock4Interface.Disconnected) {
      if (data.byteLength === 63) {
        this.state.interface = DualShock4Interface.USB
      } else {
        this.state.interface = DualShock4Interface.Bluetooth
        this.device!.receiveFeatureReport(0x02)
        return
      }
      // Player 1 Color
      this.lightbar.setColorRGB(0, 0, 64).catch(e => console.error(e))
    }

    this.state.timestamp = report.timeStamp

    // USB Reports
    if (this.state.interface === DualShock4Interface.USB && report.reportId === 0x01) {
      this.updateState(data)
    }
    // Bluetooth Reports
    if (this.state.interface === DualShock4Interface.Bluetooth && report.reportId === 0x11) {
      this.updateState(new DataView(data.buffer, 2))
      this.device!.receiveFeatureReport(0x02)
    }
  }

  updateState (data : DataView) {
    // Update thumbsticks
    this.state.axes.leftStickX = normalizeThumbstick(data.getUint8(0))
    this.state.axes.leftStickY = normalizeThumbstick(data.getUint8(1))
    this.state.axes.rightStickX = normalizeThumbstick(data.getUint8(2))
    this.state.axes.rightStickY = normalizeThumbstick(data.getUint8(3))

    // Update main buttons
    const buttons1 = data.getUint8(4)
    this.state.buttons.triangle = !!(buttons1 & 0x80)
    this.state.buttons.circle = !!(buttons1 & 0x40)
    this.state.buttons.cross = !!(buttons1 & 0x20)
    this.state.buttons.square = !!(buttons1 & 0x10)
    // Update D-Pad
    const dPad = buttons1 & 0x0F
    this.state.buttons.dPadUp = dPad === 7 || dPad === 0 || dPad === 1
    this.state.buttons.dPadRight = dPad === 1 || dPad === 2 || dPad === 3
    this.state.buttons.dPadDown = dPad === 3 || dPad === 4 || dPad === 5
    this.state.buttons.dPadLeft = dPad === 5 || dPad === 6 || dPad === 7
    // Update additional buttons
    const buttons2 = data.getUint8(5)
    this.state.buttons.l1 = !!(buttons2 & 0x01)
    this.state.buttons.r1 = !!(buttons2 & 0x02)
    this.state.buttons.l2 = !!(buttons2 & 0x04)
    this.state.buttons.r2 = !!(buttons2 & 0x08)
    this.state.buttons.share = !!(buttons2 & 0x10)
    this.state.buttons.options = !!(buttons2 & 0x20)
    this.state.buttons.l3 = !!(buttons2 & 0x40)
    this.state.buttons.r3 = !!(buttons2 & 0x80)
    const buttons3 = data.getUint8(6)
    this.state.buttons.playStation = !!(buttons3 & 0x01)
    this.state.buttons.touchPadClick = !!(buttons3 & 0x02)

    // Update Triggers
    this.state.axes.l2 = normalizeTrigger(data.getUint8(7))
    this.state.axes.r2 = normalizeTrigger(data.getUint8(8))

    // Update battery level
    this.state.charging = !!(data.getUint8(29) & 0x10)
    if (this.state.charging) {
      this.state.battery = Math.min(Math.floor((data.getUint8(29) & 0x0F) * 100 / 11))
    } else {
      this.state.battery = Math.min(100, Math.floor((data.getUint8(29) & 0x0F) * 100 / 8))
    }
    
    // Update motion input
    this.state.axes.gyroX = data.getUint16(13)
    this.state.axes.gyroY = data.getUint16(15)
    this.state.axes.gyroZ = data.getUint16(17)
    this.state.axes.accelX = data.getInt16(19)
    this.state.axes.accelY = data.getInt16(21)
    this.state.axes.accelZ = data.getInt16(23)

    // Update touchpad
    this.state.touchpad.touches = []
    if (!(data.getUint8(34) & 0x80)) {
      this.state.touchpad.touches.push({
        touchId: data.getUint8(34) & 0x7F,
        x: (data.getUint8(36) & 0x0F) << 8 | data.getUint8(35),
        y: data.getUint8(37) << 4 | (data.getUint8(36) & 0xF0) >> 4
      })
    }
    if (!(data.getUint8(38) & 0x80)) {
      this.state.touchpad.touches.push({
        touchId: data.getUint8(38) & 0x7F,
        x: (data.getUint8(40) & 0x0F) << 8 | data.getUint8(39),
        y: data.getUint8(41) << 4 | (data.getUint8(40) & 0xF0) >> 4
      })
    }
  }

  /** Sends the local rumble and lightbar state to the controller */
  async sendLocalState () {
    if (!this.device) throw new Error('Controller not initialized. You must call .init() first!')

    if (this.state.interface === DualShock4Interface.USB) {
      const report = new Uint8Array(16)

      // Report ID
      report[0] = 0x05

      // Enable Rumble (0x01), Lightbar (0x02)
      report[1] = 0xF0 | 0x01 | 0x02

      // Light rumble motor
      report[4] = this.rumble.light
      // Heavy rumble motor
      report[5] = this.rumble.heavy

      // Lightbar Red
      report[6] = this.lightbar.r
      // Lightbar Green
      report[7] = this.lightbar.g
      // Lightbar Blue
      report[8] = this.lightbar.b

      this.lastSentReport = report.buffer

      return this.device.sendReport(report[0], report.slice(1))
    } else {
      const report = new Uint16Array(75)
      
      // Header
      report[0] = 0xA2
      // Report ID
      report[1] = 0x11

      // Poll Rate
      report[2] = 0x80

      // Enable Rumble (0x01), Lightbar (0x02)
      report[3] = 0xF0 | 0x01 | 0x02
      

      // Light rumble motor
      report[7] = this.rumble.light
      // Heavy rumble motor
      report[8] = this.rumble.heavy

      // Lightbar Red
      report[9] = this.lightbar.r
      // Lightbar Green
      report[10] = this.lightbar.g
      // Lightbar Blue
      report[11] = this.lightbar.b

      // @ts-ignore
      const crc = crc32(report.buffer).toString(16)
      report[74] = (crc & 0x000000ff) >> 0
      report[75] = (crc & 0x0000ff00) >> 8
      report[76] = (crc & 0x00ff0000) >> 16
      report[77] = (crc & 0xff000000) >> 24

      this.lastSentReport = report.buffer

      return this.device.sendReport(report[1], report.slice(2))
    }
  }
}
