/**
 * Controller State
 * 
 * Stores information about the current controller state, and its components.
 */
export interface DualShock4State {
  /** Interface used for communication (USB/Bluetooth) */
  interface : DualShock4Interface

  /** Battery Level (0-100) */
  battery : number
  /** Is the battery being charged? */
  charging : boolean

  /** Analog positions */
  axes : DualShock4AnalogState
  /** Buttons pressed */
  buttons : DualShock4ButtonState
  /** Touchpad */
  touchpad : DualShock4Touchpad

  /** Timestamp of the last report */
  timestamp : number
}

/**
 * Button State
 * 
 * Stores information about the buttons that are currently being held.
 */
export interface DualShock4ButtonState {
  /** Triangle Button */
  triangle : boolean
  /** Circle Button */
  circle : boolean
  /** Cross Button */
  cross : boolean
  /** Square Button */
  square : boolean

  /** D-Pad Up */
  dPadUp : boolean
  /** D-Pad Right */
  dPadRight : boolean
  /** D-Pad Down */
  dPadDown : boolean
  /** D-Pad Left */
  dPadLeft : boolean

  /** L1 Button */
  l1 : boolean
  /** L2 Trigger (non-analog value) */
  l2 : boolean
  /** L3 Button */
  l3 : boolean

  /** R1 Button */
  r1 : boolean
  /** R2 Trigger (non-analog value) */
  r2 : boolean
  /** R3 Button */
  r3 : boolean

  /** Options Button */
  options : boolean
  /** Share Button */
  share : boolean
  /** PS Button */
  playStation : boolean

  /** Touchpad Button */
  touchPadClick : boolean
}

/**
 * Analog State
 * 
 * Stores information for analog axes.
 * 
 * - Values for thumbsticks are stored using the range **-1.0** (left, top) to **1.0** (right, bottom).
 *
 * - Values for triggers use the range **0.0** (released) to **1.0** (pressed)
 *
 * - Values for accelerometer and gyroscope use the raw input from the sensors.
 */
export interface DualShock4AnalogState {
  /** Left Stick Horizontal position. */
  leftStickX : number
  /** Left Stick Vertical position. */
  leftStickY : number

  /** Right Stick Horizontal position. */
  rightStickX : number
  /** Right Stick Vertical position. */
  rightStickY : number

  /** Left trigger analog value */
  l2 : number
  /** Right trigger analog value */
  r2 : number

  /** Accelerometer X */
  accelX : number
  /** Accelerometer Y */
  accelY : number
  /** Accelerometer Z */
  accelZ : number

  /** Angular velocity X */
  gyroX : number
  /** Angular velocity Y */
  gyroY : number
  /** Angular velocity Z */
  gyroZ : number
}

/** Touchpad State */
export interface DualShock4Touchpad {
  /** Current touches */
  touches : DualShock4TouchpadTouch[]
}

/**
 * Touchpad Touch Information
 * 
 * The touchpad's resolution is 1920x943.
 */
export interface DualShock4TouchpadTouch {
  /** Touch ID. Changes with every new touch. */
  touchId : number
  /** X Position. */
  x : number
  /** Y Position. */
  y : number
}

/**
 * Current Interface
 */
export enum DualShock4Interface {
  Disconnected = 'none',
  /** The controller is connected over USB */
  USB = 'usb',
  /** The controller is connected over BT */
  Bluetooth = 'bt'
}

/**
 * Default / Initial State
 * @ignore
 */
export const defaultState : DualShock4State = {
  interface: DualShock4Interface.Disconnected,
  battery: 0,
  charging: false,

  axes: {
    leftStickX: 0,
    leftStickY: 0,
    rightStickX: 0,
    rightStickY: 0,

    l2: 0,
    r2: 0,

    accelX: 0,
    accelY: 0,
    accelZ: 0,

    gyroX: 0,
    gyroY: 0,
    gyroZ: 0
  },

  buttons: {
    triangle: false,
    circle: false,
    cross: false,
    square: false,

    dPadUp: false,
    dPadRight: false,
    dPadDown: false,
    dPadLeft: false,

    l1: false,
    l2: false,
    l3: false,

    r1: false,
    r2: false,
    r3: false,

    options: false,
    share: false,
    playStation: false,
    touchPadClick: false
  },

  touchpad: {
    touches: []
  },

  timestamp: -1
}
