import WorkflowService from '@/services/WorkflowService'

let WorkflowTableMixin = {
  props: {
    defaultWorkflowTypeEnumId: {
      type: String,
      default: null
    },
    defaultWorkflowTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      workflowTypeEnumId: this.defaultWorkflowTypeEnumId,
      workflowTableFilter: this.defaultWorkflowTableFilter,
      workflowTableBusy: false,
      workflowTableTotalRows: 0,
      workflowTableCurrentPage: 1,
      workflowTablePerPage: 10,
      workflowTablePageOptions: [10, 25, 50],
      workflowTableFields: {
        workflowId: {
          label: 'ID',
          sortable: true
        },
        workflowName: {
          label: 'Workflow Name',
          sortable: true
        },
        workflowTypeName: {
          label: 'Workflow Type',
          sortable: true
        }
      }
    }
  },
  methods: {
    workflowDataProvider (ctx) {
      let self = this
      return WorkflowService.workflows({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter,
        workflowTypeEnumId: this.workflowTypeEnumId
      }).then(function (response) {
        self.workflowTableTotalRows = response.data.totalRows
        return response.data.workflowList || []
      })
    },
    workflowStatusClass (item) {
      return item.disabled === 'Y' ? 'line-through' : ''
    },
    refreshWorkflowTable () {
      this.$refs.workflowTable.refresh()
    }
  }
}

export default WorkflowTableMixin
