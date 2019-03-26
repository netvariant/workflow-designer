import SecurityService from '@/services/SecurityService'

let UserTableMixin = {
  props: {
    defaultUserTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      userTableFilter: this.defaultUserTableFilter,
      userTableBusy: false,
      userTableTotalRows: 0,
      userTableCurrentPage: 1,
      userTablePerPage: 10,
      userTablePageOptions: [10, 25, 50],
      userTableFields: {
        userId: {
          label: 'ID',
          sortable: true
        },
        userFullName: {
          label: 'User Full Name',
          sortable: true
        }
      }
    }
  },
  methods: {
    userDataProvider (ctx) {
      let self = this
      return SecurityService.users({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter
      }).then(function (response) {
        self.userTableTotalRows = response.data.totalRows
        return response.data.userList || []
      })
    },
    refreshUserTable () {
      this.$refs.userTable.refresh()
    }
  }
}

export default UserTableMixin
