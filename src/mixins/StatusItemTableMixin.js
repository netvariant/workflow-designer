import StatusItemService from '@/services/StatusItemService'

let StatusItemTableMixin = {
  props: {
    defaultStatusTypeId: {
      type: String,
      default: null
    },
    defaultStatusItemTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      statusTypeId: this.defaultStatusTypeId,
      statusItemTableFilter: this.defaultStatusItemTableFilter,
      statusItemTableBusy: false,
      statusItemTableTotalRows: 0,
      statusItemTableCurrentPage: 1,
      statusItemTablePerPage: 10,
      statusItemTablePageOptions: [10, 25, 50],
      statusItemTableFields: {
        statusId: {
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
    statusItemDataProvider (ctx) {
      let self = this
      return StatusItemService.statusItems({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter,
        statusTypeId: this.statusTypeId
      }).then(function (response) {
        self.statusItemTableTotalRows = response.data.totalRows
        return response.data.statusItemList || []
      })
    },
    refreshStatusItemTable () {
      this.$refs.statusItemTable.refresh()
    }
  }
}

export default StatusItemTableMixin
