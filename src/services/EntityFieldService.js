import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  entityFields (payload) {
    return SecureEndpoint().get('/moqui-workflow/entity/field', {
      params: payload
    })
  }
}
