import UomService from '@/services/UomService'

let WorkflowTimeoutProcessMixin = {
  data () {
    return {
      mutableUserData: {
        timeIntervals: [],
        timeoutUomId: this.userData.timeoutUomId
      }
    }
  },
  methods: {
    async loadInternal () {
      let self = this
      UomService.uom({
        uomTypeEnumId: 'UT_TIME_FREQ_MEASURE',
        orderByField: 'description'
      }).then(function (response) {
        self.mutableUserData.timeIntervals = response.data || []
      })
    }
  },
  mounted () {
    this.loadInternal()
  }
}

export default WorkflowTimeoutProcessMixin
