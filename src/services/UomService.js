import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  uom (payload) {
    return SecureEndpoint().get('/moqui-workflow/basic/uom', {
      params: payload
    })
  }
}
