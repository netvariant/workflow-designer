import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  statusFlows (payload) {
    return SecureEndpoint().get('/moqui-workflow/basic/status/flow', {
      params: payload
    })
  },
  statusFlowItems (payload) {
    return SecureEndpoint().get('/moqui-workflow/basic/status/flow/' + payload.statusFlowId + '/item', {
      params: payload
    })
  },
  statusFlowTransitions (payload) {
    return SecureEndpoint().get('/moqui-workflow/basic/status/flow/' + payload.statusFlowId + '/transition', {
      params: payload
    })
  }
}
