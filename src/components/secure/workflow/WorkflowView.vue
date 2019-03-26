<template>
  <section>
    <h4 class="card-title">View Workflow</h4>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <!-- Page Content -->
            <div class="content">
              <b-alert :show="alertCountDown" dismissible :variant="alertVariant" @dismissed="alertCountDown=0" @dismiss-count-down="alertCountDownChanged" class="mb-4">
                <p>{{ alertMessage }}</p>
                <b-progress :variant="alertVariant" :max="alertDisplaySeconds" :value="alertCountDown" height="4px"/>
              </b-alert>

              <div class="element-box">
                <b-button-toolbar class="mb-4">
                  <b-button @click="cancel" class="mr-2" variant="secondary">
                    <i class="fas fa-arrow-left"></i> Back
                  </b-button>
                  <b-button @click="modify" class="mr-2" variant="primary">
                    <i class="fas fa-pencil-alt"></i> Modify
                  </b-button>
                  <b-button @click="designer" class="mr-2">
                    <i class="fa fa-pencil-ruler"></i> Designer
                  </b-button>
                </b-button-toolbar>

                <div class="row hover">
                  <div class="col-md-12">
                    <p class="info-row">
                      <span>ID:</span>
                      <span>{{ workflow.workflowId }}</span>
                    </p>
                    <p class="info-row">
                      <span>Workflow Name:</span>
                      <span :class="disabledClass(workflow)">{{ workflow.workflowName }}</span>
                    </p>
                    <p class="info-row">
                      <span>Workflow Type:</span>
                      <span>{{ workflow.workflowTypeName }}</span>
                    </p>
                    <p class="info-row" v-if='workflow.description'>
                      <span>Description:</span>
                      <span>{{ workflow.description }}</span>
                    </p>
                    <p class="info-row">
                      <span>Inputted By:</span>
                      <span>{{ workflow.inputUserFullName }}</span>
                    </p>
                    <p class="info-row" v-if="workflow.updateUserFullName">
                      <span>Updated By:</span>
                      <span>{{ workflow.updateUserFullName }}</span>
                    </p>
                    <p class="info-row">
                      <span>Creation Date:</span>
                      <span>{{ workflow.creationDate | formatUnixDate }}</span>
                    </p>
                  </div>
                </div>

                <b-tabs class="mt-4">
                  <b-tab no-body active>
                    <template slot="title">
                      <i class="fas fa-bell mr-2 wd-15 text-center text-primary"></i><span>Reminders</span>
                    </template>
                    <div>
                      <b-form>
                        <b-form-row>
                          <b-col sm="3">
                            <label>Reminder Interval:</label>
                          </b-col>
                          <b-col sm="9">
                            {{ workflow.reminderInterval }} {{ workflow.reminderIntervalDescription }}
                          </b-col>
                        </b-form-row>
                        <b-form-row>
                          <b-col sm="3">
                            <label>Reminder Limit:</label>
                          </b-col>
                          <b-col sm="9">
                            {{ workflow.reminderLimit }}
                          </b-col>
                        </b-form-row>
                      </b-form>
                    </div>
                  </b-tab>
                  <b-tab no-body>
                    <template slot="title">
                      <i class="fas fa-user mr-2 wd-15 text-center text-primary"></i><span>Initiators</span>
                    </template>
                    <div>
                      <b-button-toolbar class="mb-4">
                        <b-button @click="showInitiatorForm" :disabled="initiatorFormVisible" class="mr-2" variant="primary">
                          <i class="fas fa-plus-circle"></i> Add
                        </b-button>
                      </b-button-toolbar>

                      <div class="card-body bd bg-gray-100 mb-4" v-if="initiatorFormVisible">
                        <div class="card-text">
                          <b-form>
                            <b-form-row>
                              <b-form-group class="col-md-12">
                                <label>User Group</label>
                                <user-group-lookup title="User Group" @select-record="selectUserGroupRecord"/>
                              </b-form-group>
                            </b-form-row>
                            <b-form-row>
                              <b-form-group class="col-md-6">
                                <label>From Date</label>
                                <b-form-input v-model="fromDate" type="date"/>
                              </b-form-group>
                              <b-form-group class="col-md-6">
                                <label>To Date</label>
                                <b-form-input v-model="toDate" type="date"/>
                              </b-form-group>
                            </b-form-row>

                            <b-button @click="createInitiator" class="mr-2" variant="primary">Submit</b-button>
                            <b-button @click="hideInitiatorForm" class="mr-2">Cancel</b-button>
                          </b-form>
                        </div>
                      </div>

                      <b-input-group class="mb-4">
                        <b-form-input v-model="initiatorTableFilter" placeholder="Filter"/>
                        <b-button :disabled="!initiatorTableFilter || initiatorTableBusy" @click="initiatorTableFilter = ''" slot="append">
                          <i class="fas fa-eraser"></i>
                        </b-button>
                        <b-button :disabled="initiatorTableBusy" @click="refreshInitiators" slot="append">
                          <i class="fas fa-sync-alt"></i>
                        </b-button>
                      </b-input-group>

                      <b-table ref="initiatorTable" bordered striped responsive hover class="mb-4"
                               :busy.sync="initiatorTableBusy"
                               :items="initiatorDataProvider"
                               :fields="initiatorTableFields"
                               :filter="initiatorTableFilter"
                               :current-page="initiatorTableCurrentPage"
                               :per-page="initiatorTablePerPage">
                        <template slot="fromDate" slot-scope="data">
                          {{ data.item.fromDate | formatUnixDate }}
                        </template>
                        <template slot="toDate" slot-scope="data">
                          {{ data.item.toDate | formatUnixDate }}
                        </template>
                        <template slot="options" slot-scope="data">
                          <b-button variant="danger" size="sm" :disabled="initiatorExpired(data.item)" @click="expireInitiator(data.item.initiatorId)">Expire</b-button>
                        </template>
                      </b-table>

                      <div class="row">
                        <div class="col-sm-12">
                          <div class="float-left">
                            <b-pagination :total-rows="initiatorTableTotalRows" :per-page="initiatorTablePerPage" v-model="initiatorTableCurrentPage"/>
                          </div>
                          <div class="float-right">
                            <b-form-select :options="initiatorTablePageOptions" v-model="initiatorTablePerPage" />
                          </div>
                          <div class="float-right mx-2">
                            <div class="form-control text-muted">{{ pagingInfo(initiatorTableCurrentPage, initiatorTablePerPage, initiatorTableTotalRows) }}</div>
                          </div>
                          <div class="clearfix"></div>
                        </div>
                      </div>
                    </div>
                  </b-tab>
                  <b-tab no-body>
                    <template slot="title">
                      <i class="fas fa-list mr-2 wd-15 text-center text-primary"></i> <span>Variables</span>
                    </template>
                    <div>
                      <b-button-toolbar class="mb-4">
                        <b-button @click="showVariableForm" :disabled="variableFormVisible" class="mr-2" variant="primary">
                          <i class="fas fa-plus-circle"></i> Add
                        </b-button>
                      </b-button-toolbar>

                      <div class="card-body bd bg-gray-100 mb-4" v-if="variableFormVisible">
                        <div class="card-text">
                          <b-form>
                            <b-form-row>
                              <b-form-group class="col-md-6">
                                <label>Variable Name</label>
                                <b-form-input v-model="variableName"/>
                              </b-form-group>
                              <b-form-group class="col-md-6">
                                <label>Variable Type</label>
                                <b-form-select v-model="variableTypeEnumId">
                                  <option v-for="(variableType, index) in variableTypes" :key="index" :value="variableType.enumId">{{ variableType.description }}</option>
                                </b-form-select>
                              </b-form-group>
                            </b-form-row>
                            <b-form-row>
                              <b-form-group class="col-md-12">
                                <label>Default Value</label>
                                <b-form-input v-model="defaultValue" v-if="variableTypeEnumId === 'WF_VAR_TEXT'"/>
                                <b-form-input v-model="defaultValue" type="number" v-if="variableTypeEnumId === 'WF_VAR_NUMBER'"/>
                              </b-form-group>
                            </b-form-row>
                            <b-form-row>
                              <b-form-group class="col-md-12">
                                <label>Description</label>
                                <b-form-textarea v-model="description" :rows="4"/>
                              </b-form-group>
                            </b-form-row>

                            <b-button @click="createWorkflowVariable" variant="primary" class="mr-2">Submit</b-button>
                            <b-button @click="hideVariableForm" class="mr-2">Cancel</b-button>
                          </b-form>
                        </div>
                      </div>

                      <b-input-group class="mb-4">
                        <b-form-input v-model="variableTableFilter" placeholder="Filter"/>
                        <b-button :disabled="!variableTableFilter || variableTableBusy" @click="variableTableFilter = ''" slot="append">
                          <i class="fas fa-eraser"></i>
                        </b-button>
                        <b-button :disabled="variableTableBusy" @click="refreshVariables" slot="append">
                          <i class="fas fa-sync-alt"></i>
                        </b-button>
                      </b-input-group>

                      <b-table ref="variableTable" bordered striped responsive hover class="mb-4"
                               :busy.sync="variableTableBusy"
                               :items="variableDataProvider"
                               :fields="variableTableFields"
                               :filter="variableTableFilter"
                               :current-page="variableTableCurrentPage"
                               :per-page="variableTablePerPage">
                        <template slot="description" slot-scope="data">
                          {{ data.item.description | prettyNull }}
                        </template>
                        <template slot="defaultValue" slot-scope="data">
                          {{ data.item.defaultValue | prettyNull }}
                        </template>
                      </b-table>

                      <div class="row">
                        <div class="col-sm-12">
                          <div class="float-left">
                            <b-pagination :total-rows="variableTableTotalRows" :per-page="variableTablePerPage" v-model="variableTableCurrentPage"/>
                          </div>
                          <div class="float-right">
                            <b-form-select :options="variableTablePageOptions" v-model="variableTablePerPage" />
                          </div>
                          <div class="float-right mx-2">
                            <div class="form-control text-muted">{{ pagingInfo(variableTableCurrentPage, variableTablePerPage, variableTableTotalRows) }}</div>
                          </div>
                          <div class="clearfix"></div>
                        </div>
                      </div>
                    </div>
                  </b-tab>
                </b-tabs>
              </div>
              <!-- END Page Content -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AlertMixin from '@/mixins/AlertMixin'
import DisabledClassMixin from '@/mixins/DisabledClassMixin'
import PagingTableMixin from '@/mixins/PagingTableMixin'
import UserGroupLookup from '@/components/secure/user-group/UserGroupLookup'
import EnumService from '@/services/EnumService'
import WorkflowService from '@/services/WorkflowService'

export default {
  name: 'workflow-view',
  mixins: [AlertMixin, DisabledClassMixin, PagingTableMixin],
  data: function () {
    return {
      workflow: {},
      initiatorFormVisible: false,
      userGroupId: '',
      fromDate: '',
      toDate: '',
      initiatorTableFilter: null,
      initiatorTableBusy: false,
      initiatorTableTotalRows: 0,
      initiatorTableCurrentPage: 1,
      initiatorTablePerPage: 10,
      initiatorTablePageOptions: [10, 25, 50],
      initiatorTableFields: {
        userGroupDescription: {
          label: 'User Group',
          sortable: true
        },
        fromDate: {
          label: 'From Date',
          sortable: true
        },
        toDate: {
          label: 'To Date',
          sortable: true
        },
        options: {
          label: 'Options'
        }
      },
      variableTypes: [],
      variableFormVisible: false,
      variableName: '',
      variableTypeEnumId: 'WF_VAR_TEXT',
      description: '',
      defaultValue: '',
      variableTableFilter: null,
      variableTableBusy: false,
      variableTableCurrentPage: 1,
      variableTablePerPage: 10,
      variableTablePageOptions: [10, 25, 50],
      variableTableTotalRows: 0,
      variableTableFields: {
        variableName: {
          label: 'Variable Name',
          sortable: true
        },
        variableTypeDescription: {
          label: 'Variable Type',
          sortable: true
        },
        description: {
          label: 'Description',
          sortable: true
        },
        defaultValue: {
          label: 'Default Value',
          sortable: true
        }
      }
    }
  },
  computed: {
    workflowStatusClass () {
      return this.workflow.disabled === 'Y' ? 'line-through' : ''
    }
  },
  components: {
    UserGroupLookup
  },
  methods: {
    async load () {
      let self = this
      EnumService.enum({
        enumTypeId: 'WorkflowVariableType',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.variableTypes = response.data || []
      })

      WorkflowService.workflows({
        workflowId: this.$route.params.id
      }).then(function (response) {
        self.workflow = response.data.workflowList[0] || {}
      })
    },
    initiatorDataProvider (ctx) {
      let self = this
      return WorkflowService.workflowInitiators({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter,
        workflowId: this.$route.params.id
      }).then(function (response) {
        self.initiatorTableTotalRows = response.data.totalRows
        return response.data.workflowInitiatorList || []
      })
    },
    selectUserGroupRecord (record) {
      this.userGroupId = record.userGroupId
    },
    initiatorExpired (item) {
      if (item.toDate) {
        return item.toDate < Date.now()
      } else {
        return false
      }
    },
    refreshInitiators () {
      this.$refs.initiatorTable.refresh()
    },
    showInitiatorForm () {
      this.initiatorFormVisible = true
    },
    hideInitiatorForm () {
      this.initiatorFormVisible = false
    },
    createInitiator () {
      let self = this
      WorkflowService.createWorkflowInitiator({
        workflowId: this.$route.params.id,
        userGroupId: this.userGroupId,
        fromDate: this.fromDate,
        toDate: this.toDate
      }).then(function (response) {
        self.refreshInitiators()
      }).catch(function (error) {
        self.showDangerAlert(error.response.data.errors)
      })
    },
    expireInitiator (initiatorId) {
      let self = this
      WorkflowService.expireWorkflowInitiator({
        workflowId: this.$route.params.id,
        initiatorId: initiatorId
      }).then(function (response) {
        self.refreshInitiators()
      })
    },
    variableDataProvider (ctx) {
      let self = this
      return WorkflowService.workflowVariables({
        pageIndex: ctx.currentPage - 1,
        pageSize: ctx.perPage,
        orderByField: ctx.sortDesc ? '-' + ctx.sortBy : ctx.sortBy,
        filter: ctx.filter,
        workflowId: this.$route.params.id
      }).then(function (response) {
        self.variableTableTotalRows = response.data.totalRows
        return response.data.workflowVariableList || []
      })
    },
    refreshVariables () {
      this.$refs.variableTable.refresh()
      this.variableName = ''
      this.description = ''
    },
    showVariableForm () {
      this.variableFormVisible = true
    },
    hideVariableForm () {
      this.variableFormVisible = false
    },
    createWorkflowVariable () {
      let self = this
      WorkflowService.createWorkflowVariable({
        workflowId: this.$route.params.id,
        variableName: this.variableName,
        description: this.description,
        variableTypeEnumId: this.variableTypeEnumId,
        defaultValue: this.defaultValue
      }).then(function (response) {
        self.refreshVariables()
      }).catch(function (error) {
        self.showDangerAlert(error.response.data.errors)
      })
    },
    cancel () {
      this.$router.go(-1)
    },
    designer () {
      this.$router.push({ name: 'DesignWorkflow', params: { id: this.$route.params.id } })
    },
    modify () {
      this.$router.push({ name: 'ModifyWorkflow', params: { id: this.$route.params.id } })
    }
  },
  mounted () {
    this.load()
  }
}
</script>
