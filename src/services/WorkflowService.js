import SecureEndpoint from '@/services/SecureEndpoint'

export default {
  workflows (payload) {
    return SecureEndpoint().get('/moqui-workflow/workflow', {
      params: payload
    })
  },
  createWorkflow (payload) {
    return SecureEndpoint().post('/moqui-workflow/workflow', payload)
  },
  modifyWorkflow (payload) {
    return SecureEndpoint().patch('/moqui-workflow/workflow', payload)
  },
  designWorkflow (payload) {
    return SecureEndpoint().post('/moqui-workflow/workflow/' + payload.workflowId + '/design', payload)
  },
  workflowVariables (payload) {
    return SecureEndpoint().get('/moqui-workflow/workflow/' + payload.workflowId + '/variable', {
      params: payload
    })
  },
  createWorkflowVariable (payload) {
    return SecureEndpoint().post('/moqui-workflow/workflow/' + payload.workflowId + '/variable', payload)
  },
  workflowInitiators (payload) {
    return SecureEndpoint().get('/moqui-workflow/workflow/' + payload.workflowId + '/initiator', {
      params: payload
    })
  },
  createWorkflowInitiator (payload) {
    return SecureEndpoint().post('/moqui-workflow/workflow/' + payload.workflowId + '/initiator', payload)
  },
  expireWorkflowInitiator (payload) {
    return SecureEndpoint().delete('/moqui-workflow/workflow/' + payload.workflowId + '/initiator', {
      params: payload
    })
  },
  workflowTasks (payload) {
    return SecureEndpoint().get('/moqui-workflow/workflow/task', {
      params: payload
    })
  },
  countWorkflowTasks (payload) {
    return SecureEndpoint().get('/moqui-workflow/workflow/task/count', {
      params: payload
    })
  },
  modifyWorkflowTask (payload) {
    return SecureEndpoint().patch('/moqui-workflow/workflow/task', payload)
  }
}
