<template lang="html">

  <section class="login">
    <div class="wrapper d-flex align-items-center auth login-full-bg">
      <div class="row w-100">
        <div class="col-lg-4 mx-auto">
          <div class="auth-form-dark text-left p-5">
            <div>
              <b-alert :show="alertCountDown" dismissible :variant="alertVariant" @dismissed="alertCountDown=0" @dismiss-count-down="alertCountDownChanged">
                <p>{{ alertMessage }}</p>
                <b-progress :variant="alertVariant" :max="alertDisplaySeconds" :value="alertCountDown" height="4px"/>
              </b-alert>
            </div>
            <h2>Login</h2>
            <h4 class="font-weight-light">Hello! let's get started</h4>
            <form action="#" class="pt-4" method="get" @submit.prevent="login">
              <div class="form-group">
                <label for="exampleInputEmail1">Username</label>
                <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Username" v-model="username" required/>
                <i class="fas fa-user"></i>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password" required/>
                <i class="fas fa-lock"></i>
              </div>
              <div class="mt-5">
                <button class="btn btn-block btn-primary btn-lg font-weight-medium" type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script lang="js">
import AlertMixin from '@/mixins/AlertMixin'
import SecurityService from '@/services/SecurityService'

export default {
  name: 'login',
  mixins: [AlertMixin],
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      let self = this
      SecurityService.loginUser(
        this.username,
        this.password
      ).then(function (response) {
        if (response.data.apiKey) {
          self.$store.dispatch('setUserId', {
            userId: response.data.userId
          })
          self.$store.dispatch('setUserFullName', {
            userFullName: response.data.userFullName
          })
          self.$store.dispatch('setApiKey', {
            apiKey: response.data.apiKey
          })
          self.$store.dispatch('setSessionToken', {
            sessionToken: response.data.sessionToken
          })
          self.$store.dispatch('setLanguage', {
            language: response.data.locale
          })

          if (self.$store.state.requestPath) {
            let requestPath = self.$store.state.requestPath
            self.$store.dispatch('setRequestPath', { setRequestPath: null })
            self.$router.push({ path: requestPath })
          } else {
            self.$router.push({ name: 'Secure' })
          }
        } else {
          self.showDangerAlert(response.data.errors)
        }
      }).catch(function (error) {
        if (error.response.status === 401) {
          self.showDangerAlert(error.response.data.errors || 'Invalid username or password')
        } else {
          self.showDangerAlert(error.response.data.errors)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login {

}
</style>
