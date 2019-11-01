<template>
  <div>
    <div v-for="(controller, i) in controllers" :key="i">
      <h2>
        Controller #{{i}} ({{controller.state.interface.toUpperCase()}},
        Battery: {{controller.state.battery}}%
        <span v-if="controller.state.charging">[charging]</span>)
      </h2>
      <div class="params">
        <h4>Lightbar Color</h4>
        <label>R: </label><input type="range" min="0" max="255" v-model="controller.lightbar.r"> ({{controller.lightbar.r}})<br>
        <label>G: </label><input type="range" min="0" max="255" v-model="controller.lightbar.g"> ({{controller.lightbar.g}})<br>
        <label>B: </label><input type="range" min="0" max="255" v-model="controller.lightbar.b"> ({{controller.lightbar.b}})
        <h4>Rumble</h4>
        <label>Weak: </label><input type="range" min="0" max="255" v-model="controller.rumble.light">  ({{controller.rumble.light}})<br>
        <label>Strong: </label><input type="range" min="0" max="255" v-model="controller.rumble.heavy">  ({{controller.rumble.heavy}})
      </div>
      <div class="buttons">
        <h3>Buttons</h3>
        <div class="btn" v-for="(button, btnKey) in controller.state.buttons" :key="btnKey" :style="{ opacity: button ? 1 : 0.5 }">
          <b class="name">{{btnKey}}</b><br>
          {{button ? '1.00' : '0.00'}}
        </div>
      </div>
      <div class="analogs">
        <h3>Analogs</h3>
        <div class="analog" v-for="(analog, anaKey) in controller.state.axes" :key="anaKey" :style="{ opacity: 0.5 + Math.min(0.5, Math.abs(analog) * .5) }">
          <b class="name">{{anaKey}}</b><br>
          {{analog.toFixed(2)}}
        </div>
      </div>
      <div class="touchpad">
        <h3>Touchpad</h3>
        <div v-if="!controller.state.touchpad.touches.length">
          No touches detected.
        </div>
        <div v-else v-for="touch in controller.state.touchpad.touches" :key="touch.touchId">
          <b>Touch #{{touch.touchId}}:</b> {{touch.x}}, {{touch.y}}
        </div>
      </div>
    </div>
    <br><br>
    <button v-if="hidSupported" @click="addController">Connect Controller</button>
    <div v-else>
      Your browser doesn't seem to support WebHID yet.<br>
      If you are using Chrome, make sure to have at least version 78, and enable the
      <a href="chrome://flags/#enable-experimental-web-platform-features">experimental web platform features</a> flag.
    </div>
  </div>
</template>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-weight: 300;
  margin: auto;
  padding: 16px;
  max-width: 960px;
}

h1, h2, h3, h4, h5 {
  font-weight: 100;
}

a {
  color: #689F38;
  text-decoration: none;
}

code {
  background: #E0E0E0;
  padding: 4px;
  border-radius: 2px;
}

pre {
  width: 100%;
  background: #E0E0E0;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #BDBDBD;
  overflow-x: auto;
}

blockquote {
  border-left: 2px solid #BDBDBD;
  padding-left: 4px;
  margin-left: 0;
}

img {
  max-height: 70vh;
  max-width: 100%;
}

.buttons .btn {
  display: inline-block;
  background: #AAAAAA;
  margin: 4px;
  padding: 8px;
  transition: opacity 300ms ease
}

.analogs .analog {
  display: inline-block;
  background: #AAAAAA;
  margin: 4px;
  padding: 8px;
  transition: opacity 300ms ease;
  min-width: 64px;
}

.name {
  text-transform: capitalize;
}
</style>
<script>
import { DualShock4 } from '../src'

export default {
  data () {
    return {
      controllers: []
    }
  },
  methods: {
    async addController () {
      const controller = new DualShock4()
      await controller.init()
      this.controllers.push(controller)
    }
  },
  computed: {
    hidSupported () {
      return !!(window.navigator.hid && window.navigator.hid.requestDevice)
    }
  }
}
</script>
