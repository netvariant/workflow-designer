import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  workflowTypes (payload) {
    return SecureEndpoint().get('/moqui-workflow/workflowType', {
      params: payload
    })
  }
}
