import SecurityService from '@/services/SecurityService'

let UserGroupTableMixin = {
  props: {
    defaultUserGroupTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      userGroupTableFilter: this.defaultUserGroupTableFilter,
      userGroupTableBusy: false,
      userGroupTableTotalRows: 0,
      userGroupTableCurrentPage: 1,
      userGroupTablePerPage: 10,
      userGroupTablePageOptions: [10, 25, 50],
      userGroupTableFields: {
        userGroupId: {
          label: 'ID',
          sortable: true
        },
        description: {
          label: 'User Group',
          sortable: true
        }
      }
    }
  },
  methods: {
    userGroupDataProvider (ctx) {
      let self = this
      return SecurityService.userGroups({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter
      }).then(function (response) {
        self.userGroupTableTotalRows = response.data.totalRows
        return response.data.userGroupList || []
      })
    },
    refreshUserGroupTable () {
      this.$refs.userGroupTable.refresh()
    }
  }
}

export default UserGroupTableMixin
