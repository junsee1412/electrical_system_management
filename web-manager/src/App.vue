<template>
  <header-vue />
  <div class="container-fluid">
    <div class="row">
      <div class="col-xl-4 mb-3">
        <detailt-device :devices="devices" :index="index" />
      </div>
      <div class="col-xl-8">
        <div class="row">
          <div v-for="({ dev }, index) in devices" :key="({ dev }, index)" class="col-md-4 col-sm-6 mb-4">
            <card-device v-on:click="detailDev(index)" :device="devices[index]" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer-vue />
</template>

<script>
import HeaderVue from './components/HeaderVue.vue'
import CardDevice from './components/CardDevice.vue'
import DetailtDevice from './components/DetailtDevice.vue'
import FooterVue from './components/FooterVue.vue'

export default {
  name: 'App',
  components: {
    HeaderVue,
    CardDevice,
    DetailtDevice,
    FooterVue,
},
  data: () => {
    return {
      socket: null,
      index: 0,
      devices: [],
    }
  },
  methods: {
    detailDev: function(index) {
      this.index = index
    }
  },
  created: async function() {
    this.socket = await new WebSocket('ws://localhost:3000/ws', 'web')

    this.socket.onopen = () => {
      console.log("Connected")
    }

    this.socket.onmessage = (event) => {
      let jsonDat = String(event.data)
      let jsonDat1 = JSON.parse(jsonDat)
      this.devices = jsonDat1
    }
  }
}
</script>

<style></style>
