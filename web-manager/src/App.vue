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
    },
    makeID: function(length) {
      let result = '';
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;
      for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
      }
      return result;
    },
  },
  created: async function() {
    let ip = '192.168.1.26'
    this.socket = await new WebSocket(`ws://${ip}:3000/ws`, ['vuejs', this.makeID(10)])

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
