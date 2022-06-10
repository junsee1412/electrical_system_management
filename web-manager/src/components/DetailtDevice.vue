<template>
  <div class="card shadow">
    <div class="card-body">
      <h5 class="card-title">Detailt Module</h5>
      <div v-if="devices[index]">
        <p class="card-text">MAC Address: <span>{{ devices[index].mac }}</span></p>
        <p class="card-text">Type: <span>{{ devices[index].type }}</span></p>
        <div class="demo-inline-spacing mt-3">
          <p class="card-subtitle text-muted mb-3">Connected:</p>
          <ul class="list-group list-group">
            <li v-for="({  }, i) in devices[index].connect" :key="i" class="list-group-item d-flex justify-content-between align-items-center">
              {{ devices[index].connect[i] }}
              <button v-on:click="disconectDev(devices[index], i)" class="btn btn-warning">Disconect</button>
            </li>
            <li class="list-group-item list-group-item-action" data-bs-toggle="modal" data-bs-target="#addMacCon" >Add...</li>
          </ul>
        </div>
        <small v-if="devices[index].state" class="text-success fw-semibold">STATE: ON</small>
        <small v-else class="text-danger fw-semibold">STATE: OFF</small>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="devices[index]" class="modal fade" id="addMacCon" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Connect Module</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="list-group">
              <div v-for="device in devices" :key="device">
                <div v-if="!devices[index].connect.includes(device.mac) && devices[index].mac != device.mac && devices[index].type != device.type">
                  <a v-on:click="connectDev(devices[index], device.mac)" class="list-group-item list-group-item-action" data-bs-dismiss="modal">
                    {{ device.mac }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiDevices from '@/services/apiDevices';

export default{
  name: 'DetailtDevice',
  props: {
    index: Number,
    devices: Array,
  },
  methods: {
    changeState: function(state) {
      this.$root.socket.send(state)
    },
    disconectDev: async function(device ,index1) {
      let array1 = device.connect
      let rmMacCon1 = device.mac
      let rmMacCon2 = device.connect[index1]
      array1.splice(index1, 1)
      
      for (let i in this.devices) {
        if (this.devices[i].mac === rmMacCon2) {
          let array2 = this.devices[i].connect
          let index2 = array2.indexOf(rmMacCon1);
          if (index2 !== -1) {
            array2.splice(index2, 1);
          }
        }
        
      }
      await apiDevices.updateConnect(rmMacCon1, array1)
    },
    connectDev: async function(device, mac2Con) {
      let array1 = device.connect
      array1.push(mac2Con)

      for (let i in this.devices) {
        if (this.devices[i].mac === mac2Con) {
          let array2 = this.devices[i].connect
          array2.push(device.mac)
        }
      }
      await apiDevices.updateConnect(device.mac, array1)
    }
  },
};
</script>
<style></style>\