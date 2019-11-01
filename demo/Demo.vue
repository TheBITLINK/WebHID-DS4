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
      <div v-for="touch in controller.state.touchpad.touches" :key="touch.touchId">
        <b>Touch #{{touch.touchId}}:</b> {{touch.x}}, {{touch.y}}
      </div>
    </div>
    <br><br>
    <button @click="addController">Connect Controller</button>
  </div>
</template>
<style scoped>
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
  }
}
</script>
