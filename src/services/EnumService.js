import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  enum (payload) {
    return SecureEndpoint().get('/moqui-workflow/basic/enum', {
      params: payload
    })
  }
}
