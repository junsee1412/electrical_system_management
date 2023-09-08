<template>
  <nav class="layout-navbar navbar navbar-expand-lg shadow navbar-detached border border-white border-3 mb-5">
    <div class="container-fluid">
      <a class="navbar-brand text-secondary" href="/">
        <img src="/favicon.png" alt="" width="30" height="30" class="d-inline-block align-text-top">
        DT Manager
      </a>
      <div class="d-flex">
        <button v-on:click="pushScan('false')" class="btn btn-outline-success me-2" data-bs-toggle="modal" data-bs-target="#modalCenter" ><i class='bx bx-message-square-add'></i></button>
        <button v-on:click="pushScan('true')" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#modalCenter" ><i class="bx bx-sitemap"></i></button>
      </div>
    </div>
  </nav>
  <!-- Modal -->
  <div class="modal fade" id="modalCenter" tabindex="-1" aria-modal="true" role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalCenterTitle">Scan Module</h5>
          <button v-on:click="clearRes()" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="response.length == 0" class="d-flex align-items-center">
            <strong>Loading...</strong>
            <div class="spinner-border spinner-border-lg text-primary ms-auto" role="status" aria-hidden="true"></div>
          </div>
          <ul v-else class="list-group">
            <li v-for="outDevBD in response" :key="outDevBD" class="list-group-item d-flex justify-content-between align-items-center">
              <i v-if="outDevBD.type === 'switch'" class="bx bx-toggle-left me-2"></i>
              <i v-else class="bx bx-bulb me-2"></i>
              {{ outDevBD.mac }}
              <span>
                <small><a :href="'http://' + outDevBD.ip" target="_blank" rel="noopener noreferrer">{{ outDevBD.ip }}</a></small>
              </span>
              <button v-if="bol != 'true'" v-on:click="addNew({mac: outDevBD.mac, type: outDevBD.type, state: outDevBD.state ? true : false})" class="btn btn-primary" data-bs-dismiss="modal">Add</button>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button v-on:click="clearRes()" type="button" class="btn btn-outline-primary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import apiDevices from '@/services/apiDevices';

export default{
  name: 'HeaderVue',
  props: {
    device: Object,
  },
  data: () => {
    return {
      response: [],
      scanmode: '',
    }
  },
  methods: {
    clearRes: function() {
      this.response = []
    },
    addNew: async function(device) {
      const newDev = await apiDevices.addDevices(device)
      this.$root.devices.push(newDev.data)
      this.clearRes()
    },
    pushScan: async function(bol) {
      this.scanmode = bol
      const res = await apiDevices.scanDevices(bol)
      this.response = res.data
    },
  },
};
</script>
<style></style>