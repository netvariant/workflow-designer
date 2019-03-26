import WorkflowService from '@/services/WorkflowService'

let WorkflowTaskTableMixin = {
  props: {
    defaultWorkflowTypeEnumId: {
      type: String,
      default: null
    },
    defaultTaskTableFilter: {
      type: String,
      default: null
    },
    defaultTaskTableView: {
      type: String,
      default: 'ALL_TASKS'
    }
  },
  data: function () {
    return {
      workflowTypeEnumId: this.defaultWorkflowTypeEnumId,
      taskTableFilter: this.defaultTaskTableFilter,
      taskTableBusy: false,
      taskTableTotalRows: 0,
      taskTableCurrentPage: 1,
      taskTablePerPage: 10,
      taskTablePageOptions: [10, 25, 50],
      taskTableView: this.defaultTaskTableView,
      taskTableViewOptions: [
        { id: 'ALL_TASKS', name: 'All Tasks' },
        { id: 'APPROVAL_TASKS', name: 'Approval Tasks' },
        { id: 'VARIABLE_TASKS', name: 'Variable Tasks' },
        { id: 'MANUAL_TASKS', name: 'Manual Tasks' }
      ],
      taskTableFields: {
        taskId: {
          label: 'ID',
          sortable: true
        },
        workflowName: {
          label: 'Workflow Name',
          sortable: true
        },
        taskTypeDescription: {
          label: 'Task Type',
          sortable: true
        },
        statusDescription: {
          label: 'Status',
          sortable: true
        },
        instanceTimeoutDate: {
          label: 'Due Date',
          sortable: true
        }
      }
    }
  },
  computed: {
    taskTableViewName: function () {
      for (let i = 0; i < this.taskTableViewOptions.length; i++) {
        if (this.taskTableViewOptions[i].id === this.taskTableView) {
          return this.taskTableViewOptions[i].name
        }
      }
      return 'Unknown'
    }
  },
  methods: {
    taskDataProvider (ctx) {
      let self = this
      switch (this.taskTableView) {
        case 'APPROVAL_TASKS': {
          return WorkflowService.workflowTasks({
            pageIndex: ctx.currentPage - 1,
            pageSize: ctx.perPage,
            orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
            filter: ctx.filter,
            workflowTypeEnumId: this.workflowTypeEnumId,
            workflowDisabled: 'N',
            instanceStatusId: 'WF_INST_STAT_ACTIVE',
            taskTypeEnumId: 'WF_TASK_APPROVAL',
            assignedUserId: self.$store.state.userId
          }).then(function (response) {
            self.taskTableTotalRows = response.data.totalRows
            return response.data.taskList || []
          })
        }
        case 'VARIABLE_TASKS': {
          return WorkflowService.workflowTasks({
            pageIndex: ctx.currentPage - 1,
            pageSize: ctx.perPage,
            orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
            filter: ctx.filter,
            workflowTypeEnumId: this.workflowTypeEnumId,
            workflowDisabled: 'N',
            instanceStatusId: 'WF_INST_STAT_ACTIVE',
            taskTypeEnumId: 'WF_TASK_VARIABLE',
            assignedUserId: self.$store.state.userId
          }).then(function (response) {
            self.taskTableTotalRows = response.data.totalRows
            return response.data.taskList || []
          })
        }
        case 'MANUAL_TASKS': {
          return WorkflowService.workflowTasks({
            pageIndex: ctx.currentPage - 1,
            pageSize: ctx.perPage,
            orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
            filter: ctx.filter,
            workflowTypeEnumId: this.workflowTypeEnumId,
            workflowDisabled: 'N',
            instanceStatusId: 'WF_INST_STAT_ACTIVE',
            taskTypeEnumId: 'WF_TASK_MANUAL',
            assignedUserId: self.$store.state.userId
          }).then(function (response) {
            self.taskTableTotalRows = response.data.totalRows
            return response.data.taskList || []
          })
        }
        default: {
          return WorkflowService.workflowTasks({
            pageIndex: ctx.currentPage - 1,
            pageSize: ctx.perPage,
            orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
            filter: ctx.filter,
            workflowTypeEnumId: this.workflowTypeEnumId,
            workflowDisabled: 'N',
            instanceStatusId: 'WF_INST_STAT_ACTIVE',
            assignedUserId: self.$store.state.userId
          }).then(function (response) {
            self.taskTableTotalRows = response.data.totalRows
            return response.data.taskList || []
          })
        }
      }
    },
    setTaskTableView (view) {
      this.taskTableView = view.id
      this.$refs.taskTable.refresh()
    },
    refreshTaskTable () {
      this.$refs.taskTable.refresh()
    }
  }
}

export default WorkflowTaskTableMixin
