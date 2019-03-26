<template lang="html">
  <section class="app-sidebar">
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul class="nav" >
        <li class="nav-item" v-for="(item, index) in itemsList" :key="index">
          <router-link class="nav-link" :to="{ name: item.url}">
            <i :class="item.iconClass" class="text-primary mr-2"></i>
            <span class="menu-title">{{item.label}}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script lang="js">
import MainMenu from '@/navigation/MainMenu'

export default {
  name: 'app-sidebar',
  data () {
    return {
      itemsList: MainMenu.items
    }
  }
}
</script>

<style scoped lang="scss">
.app-sidebar {

}
</style>
