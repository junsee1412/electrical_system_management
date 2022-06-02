<template>
  <div class="card shadow">
    <div class="card-body">
      <div class="card-title d-flex align-items-start justify-content-between">
        <div v-on:click="changeState(`${device.mac} ${device.state ? 'OFF' : 'ON'}`)" class="avatar flex-shrink-0">
          <img :src="'icon/' + device.type + '.' + device.state + '.png'" alt="Icon Module" class="rounded">
        </div>
        <div class="btn-group">
          <button type="button" class="btn p-0 dropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bx bx-dots-vertical-rounded"></i>
          </button>
          <ul class="dropdown-menu">
            <li><button v-on:click="deleteDev(device.mac)" class="dropdown-item">Delete</button></li>
          </ul>
        </div>
      </div>
      <h5 class="card-title d-block mb-1">{{ device.mac }}</h5>
      <small v-if="device.state" class="text-success fw-semibold">STATE: ON</small>
      <small v-else class="text-danger fw-semibold">STATE: OFF</small>
    </div>
  </div>
</template>
<script>
import apiDevices from '@/services/apiDevices'

export default{
  name: 'CardDevice',
  props: {
    device: Object,
  },
  methods: {
    changeState: function(state) {
      this.$root.socket.send(state)
    },
    deleteDev: async function(mac) {
      let array = this.$root.devices
      let index = this.$root.devices.indexOf(this.device)
      if (index !== -1) {
        array.splice(index, 1);
      }
      
      await apiDevices.deleteDevices(mac)
    },
  },
};
</script>
<style>
</style>