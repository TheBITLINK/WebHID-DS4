# WebHID-DS4

A browser API for Sony DualShock 4 controllers built over the WebHID API.

Provides high level APIs to access most of the controller's features over USB and Bluetooth.

### Supported Features

 - USB and Bluetooth connectivity
 - Gyro & Accelerometer data
 - Touchpad Input
 - Buttons & Analogs
 - Lightbar RGB values
 - Rumble motors
 
### Known Issues

 - Setting the lightbar colors and rumble intensity over Bluetooth is currently broken.
 - There's currently no way to detect if a controller has been disconnected.
 - There's currently no way to detect if a controller has already been connected either.
 - Not all DS4 Models are supported by this library. I only have a CUH-ZCT2U, so that's what i used to test. Support for third party controllers is not guaranteed.

### Installation

```npm install --save webhid-ds4```

### Usage Example

```js
import { DualShock4 } from 'webhid-ds4'

// The WebHID device can only be requested upon user interaction
document.getElementById('connectButton').addEventListener('click', async () => {
  const DS4 = new DualShock4()
  // This will request the WebHID device and initialize the controller
  await DS4.init()
  // Define a custom lightbar color
  await DS4.lightbar.setColorRGB(170, 255, 0)
  // The state object is updated periodically with the current controller state
  function logInputs () {
    requestAnimationFrame(logInputs)
    document.getElementById('triangle').innerText = `Triangle Button: ${DS4.state.buttons.triangle}`
    document.getElementById('circle').innerText = `Circle Button: ${DS4.state.buttons.circle}`
    document.getElementById('cross').innerText = `Cross Button: ${DS4.state.buttons.cross}`
    document.getElementById('square').innerText = `Square Button: ${DS4.state.buttons.square}`

    document.getElementById('leftStick').innerText = `Left Stick: ${DS4.state.axes.leftStickX}, ${DS4.state.axes.leftStickY}`
    document.getElementById('rightStick').innerText = `Right Stick: ${DS4.state.axes.rightStickX}, ${DS4.state.axes.rightStickY}`
  }
  logInputs()
})
```

### Documentation

API Documentation is available [here](https://thebitlink.github.io/WebHID-DS4/api/)
