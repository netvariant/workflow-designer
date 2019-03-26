<template lang="html">

  <section class="error-404">
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center text-center error-page bg-primary">
          <div class="row flex-grow">
            <div class="col-lg-8 mx-auto text-white">
              <div class="row align-items-center d-flex flex-row">
                <div class="col-lg-6 text-lg-right pr-lg-4">
                  <h1 class="display-1 mb-0">403</h1>
                </div>
                <div class="col-lg-6 error-page-divider text-lg-left pl-lg-4">
                  <h2>You just found an error!</h2>
                  <h3 class="font-weight-light">You don't have permission to view this page.</h3>
                </div>
              </div>
              <div class="row mt-5">
                <div class="col-12 text-center mt-xl-2">
                  <b-link class="text-white font-weight-medium" @click="back">Back</b-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- content-wrapper ends -->
      </div>
      <!-- page-body-wrapper ends -->
    </div>
  </section>

</template>

<script lang="js">
export default {
  name: 'error403',
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.error-404 {

}
</style>
