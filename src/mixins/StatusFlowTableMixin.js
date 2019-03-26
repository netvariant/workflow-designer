import StatusFlowService from '@/services/StatusFlowService'

let StatusFlowTableMixin = {
  props: {
    defaultStatusTypeId: {
      type: String,
      default: null
    },
    defaultStatusFlowTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      statusTypeId: this.defaultStatusTypeId,
      statusFlowTableFilter: this.defaultStatusFlowTableFilter,
      statusFlowTableBusy: false,
      statusFlowTableTotalRows: 0,
      statusFlowTableCurrentPage: 1,
      statusFlowTablePerPage: 10,
      statusFlowTablePageOptions: [10, 25, 50],
      statusFlowTableFields: {
        statusFlowId: {
          label: 'ID',
          sortable: true
        },
        description: {
          label: 'Description',
          sortable: true
        }
      }
    }
  },
  methods: {
    statusFlowDataProvider (ctx) {
      let self = this
      return StatusFlowService.statusFlows({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter,
        statusTypeId: this.statusTypeId
      }).then(function (response) {
        self.statusFlowTableTotalRows = response.data.totalRows
        return response.data.statusFlowList || []
      })
    },
    refreshStatusFlowTable () {
      this.$refs.statusFlowTable.refresh()
    }
  }
}

export default StatusFlowTableMixin
