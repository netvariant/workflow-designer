<template lang="html">
  <div class="container-scroller">
    <app-header/>
    <div class="container-fluid page-body-wrapper">
      <app-sidebar/>
      <div class="main-panel">
        <div class="content-wrapper">
          <router-view></router-view>
        </div>
        <!-- content wrapper ends -->
        <app-footer/>
      </div>
      <!-- main panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
</template>

<script lang="js">
import AppHeader from '@/components/theme/fragments/AppHeader'
import AppSidebar from '@/components/theme/fragments/AppSidebar'
import AppFooter from '@/components/theme/fragments/AppFooter'
import main from '@/assets/js/main'

export default {
  name: 'Main',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  },
  mounted () {
    main.full_screen_toggler()
    main.full_screen()
  }
}
</script>
