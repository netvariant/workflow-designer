<template lang="html">
  <b-navbar class="fixed-top" toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <div class="text-center navbar-brand-wrapper d-flex align-items-top justify-content-center">
      <router-link :to="{ name: 'Secure', params: {} }"><img class="logo" src="@/assets/images/MoquiLogoNew.png" alt="moqui logo"></router-link>
    </div>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right class="preview-list">
          <template slot="button-content">
            <div class="count-indicator">
              <i class="fas fa-user-circle fa-lg"></i>
            </div>
          </template>
          <b-dropdown-item @click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import SecurityService from '@/services/SecurityService'

export default {
  name: 'app-header',
  methods: {
    logout () {
      let self = this
      SecurityService.logoutUser().then(function (response) {
        self.$store.dispatch('resetState')
        self.$router.push({ name: 'Login' })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.app-header {
}
</style>
