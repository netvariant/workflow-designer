<template>
  <section>
    <h4 class="card-title">View Task</h4>
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
                  <template v-for="transition in transitions">
                    <b-button v-bind:key="transition.toStatusId" @click="selectTransition(transition)" class="mr-2" :variant="transitionButtonVariant(transition)">
                      {{ transition.transitionName }}
                    </b-button>
                  </template>
                </b-button-toolbar>

                <div class="card-body bd bg-gray-100 mb-4" v-if="statusId">
                  <div>
                    <b-form>
                      <b-form-row v-if="task.variableId">
                        <b-form-group class="col-md-12">
                          <label>Value</label>
                          <b-form-input v-if="task.variableTypeEnumId === 'WF_VAR_NUMBER'" type="number" v-model="task.variableDefinedValue"/>
                          <b-form-input v-else v-model="task.variableDefinedValue"/>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group class="col-md-12">
                          <label>Remark</label>
                          <b-form-textarea v-model="task.remark" :rows="4"/>
                        </b-form-group>
                      </b-form-row>

                      <b-button @click="modifyWorkflowTask" class="mr-2" variant="primary">Submit</b-button>
                      <b-button @click="statusId = ''" class="mr-2">Cancel</b-button>
                    </b-form>
                  </div>
                </div>

                <b-row>
                  <b-col>
                    <b-form>
                      <b-form-row>
                        <b-col sm="4">
                          <label>ID:</label>
                        </b-col>
                        <b-col sm="8">
                          {{ task.taskId }}
                        </b-col>
                      </b-form-row>
                      <b-form-row>
                        <b-col sm="4">
                          <label>Workflow Name:</label>
                        </b-col>
                        <b-col sm="8">
                          {{ task.workflowName }}
                        </b-col>
                      </b-form-row>
                      <b-form-row>
                        <b-col sm="4">
                          <label>Task Type:</label>
                        </b-col>
                        <b-col sm="8">
                          {{ task.taskTypeDescription }}
                        </b-col>
                      </b-form-row>
                      <b-form-row>
                        <b-col sm="4">
                          <label>Status:</label>
                        </b-col>
                        <b-col sm="8">
                          {{ task.statusDescription }}
                        </b-col>
                      </b-form-row>
                      <b-form-row>
                        <b-col sm="4">
                          <label>Creation Date:</label>
                        </b-col>
                        <b-col sm="8">
                          {{ task.creationDate | formatUnixTimestamp }}
                        </b-col>
                      </b-form-row>
                      <b-form-row v-if="task.instanceTimeoutDate">
                        <b-col sm="4">
                          <label>Due Date:</label>
                        </b-col>
                        <b-col sm="8">
                          {{ task.instanceTimeoutDate | formatUnixTimestamp }}
                        </b-col>
                      </b-form-row>
                    </b-form>
                  </b-col>
                  <b-col>
                    <b-form-row v-if="task.variableName">
                      <b-col sm="4">
                        <label>Variable Name:</label>
                      </b-col>
                      <b-col sm="8">
                        {{ task.variableName }}
                      </b-col>
                    </b-form-row>
                    <b-form-row v-if="task.variableDescription">
                      <b-col sm="4">
                        <label>Description:</label>
                      </b-col>
                      <b-col sm="8">
                        {{ task.variableDescription }}
                      </b-col>
                    </b-form-row>
                    <b-form-row v-if="task.variableDefinedValue">
                      <b-col sm="4">
                        <label>Value:</label>
                      </b-col>
                      <b-col sm="8">
                        {{ task.variableDefinedValue }}
                      </b-col>
                    </b-form-row>
                    <b-form-row v-if="task.summary">
                      <b-col sm="4">
                        <label>Summary:</label>
                      </b-col>
                      <b-col sm="8">
                        {{ task.summary }}
                      </b-col>
                    </b-form-row>
                    <b-form-row v-if="task.description">
                      <b-col sm="4">
                        <label>Description:</label>
                      </b-col>
                      <b-col sm="8">
                        {{ task.description }}
                      </b-col>
                    </b-form-row>
                  </b-col>
                </b-row>
              </div>
            </div>
            <!-- END Page Content -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AlertMixin from '@/mixins/AlertMixin'
import PagingTableMixin from '@/mixins/PagingTableMixin'
import EnumService from '@/services/EnumService'
import WorkflowService from '@/services/WorkflowService'
import StatusFlowService from '@/services/StatusFlowService'

export default {
  name: 'workflow-task-view',
  mixins: [AlertMixin, PagingTableMixin],
  data: function () {
    return {
      task: {},
      transitions: [],
      statusId: null
    }
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

      WorkflowService.workflowTasks({
        taskId: this.$route.params.id
      }).then(function (response) {
        self.task = response.data.taskList[0] || {}
        self.loadTransitions()
      })
    },
    loadTransitions () {
      let self = this
      StatusFlowService.statusFlowTransitions({
        statusFlowId: 'WorkflowTaskStatusFlow',
        statusId: self.task.statusId,
        conditionExpression: self.task.taskTypeEnumId,
        orderByField: 'transitionSequence'
      }).then(function (response) {
        self.transitions = response.data.transitionList || []
        if (self.transitions.length === 0) {
          self.$router.back()
        }
      })
    },
    errorCountDownChanged (errorCountDown) {
      this.errorCountDown = errorCountDown
    },
    transitionButtonVariant (transition) {
      if (transition.toStatusId === 'WF_TASK_STAT_APPROVE') {
        return 'success'
      } else if (transition.toStatusId === 'WF_TASK_STAT_REJECT') {
        return 'danger'
      } else if (transition.toStatusId === 'WF_TASK_STAT_DONE') {
        return 'primary'
      } else {
        return ''
      }
    },
    selectTransition (transition) {
      this.statusId = transition.toStatusId
    },
    modifyWorkflowTask () {
      let self = this
      WorkflowService.modifyWorkflowTask({
        taskId: this.$route.params.id,
        statusId: this.statusId,
        remark: this.task.remark,
        definedValue: this.task.variableDefinedValue
      }).then(function (response) {
        if (response.status === 200) {
          self.statusId = ''
          self.remark = ''
          self.load()
        }
      }).catch(function (error) {
        self.showDangerAlert(error.response.data.errors)
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.load()
  }
}
</script>
