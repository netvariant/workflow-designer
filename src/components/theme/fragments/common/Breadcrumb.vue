<template>
  <ul class="breadcrumb">
    <template v-for="(item, index) in list">
      <li class="breadcrumb-item" :key="index">
        <span v-if="isLast(index) && item">{{ showName(item) }}</span>
        <router-link :to="item" v-else>{{ showName(item) }}</router-link>
      </li>
      </template>
  </ul>
</template>

<script>
export default {
  name: 'Breadcrumb',
  methods: {
    isLast (index) {
      return index === this.list.length - 1
    },
    showName (item) {
      let name = item.name
      if (item.meta && item.meta.navKey) {
        name = item.meta.navKey
      }
      return name
    }
  },
  computed: {
    list () {
      return this.$route.matched
    }
  }
}
</script>
