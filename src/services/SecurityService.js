import SecureEndpoint from '@/services/SecureEndpoint'
import PublicEndpoint from '@/services/PublicEndpoint'

export default {
  userGroups (payload) {
    return SecureEndpoint().get('/moqui-workflow/security/userGroup', {
      params: payload
    })
  },
  users (payload) {
    return SecureEndpoint().get('/moqui-workflow/security/user', {
      params: payload
    })
  },
  loginUser (username, password) {
    let authorization = 'Basic ' + btoa(username + ':' + password)
    return PublicEndpoint().post('/moqui-workflow/security/user/login', {}, {
      headers: {
        'Authorization': authorization
      }
    })
  },
  logoutUser () {
    return SecureEndpoint().post('/moqui-workflow/security/user/logout')
  }
}
