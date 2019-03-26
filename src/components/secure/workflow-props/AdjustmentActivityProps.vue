<template>
  <div>
    <b-form class="mb-4">
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Activity Description</label>
          <b-form-input v-model="mutableUserData.activityDescription"/>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Adjustment Type</label>
          <b-form-radio-group v-model="mutableUserData.adjustmentTypeEnumId">
            <b-form-radio v-for="(enumObj, index) in adjustmentTypes" :key="index" :value="enumObj.enumId">{{ enumObj.description }}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.adjustmentTypeEnumId === 'WF_ADJUST_STATUS'">
        <b-form-group class="col-md-12">
          <label>Status</label>
          <b-form-select v-model="mutableUserData.statusId" @change="statusValueChanged">
            <option v-for="(statusItem, index) in statusItems" :key="index" :value="statusItem.statusId">{{ statusItem.description }}</option>
          </b-form-select>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.adjustmentTypeEnumId === 'WF_ADJUST_VARIABLE'">
        <b-form-group class="col-md-12">
          <label>Variable</label>
          <b-form-select v-model="mutableUserData.variableId" @change="variableValueChanged">
            <option v-for="(variable, index) in variables" :key="index" :value="variable.variableId">{{ variable.variableName }}</option>
          </b-form-select>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.adjustmentTypeEnumId === 'WF_ADJUST_VARIABLE'">
        <b-form-group class="col-md-12">
          <label>Script</label>
          <div class="code-editor">
            <codemirror v-model="mutableUserData.definedValue" :options="valueOptions" class="workflow-code-editor"></codemirror>
          </div>
        </b-form-group>
      </b-form-row>

      <b-button @click="save" class="mr-2" variant="primary">Save</b-button>
      <b-button @click="cancel" class="mr-2">Cancel</b-button>
    </b-form>
  </div>
</template>

<script>
import WorkflowProcessMixin from '@/mixins/WorkflowProcessMixin'
import EnumService from '@/services/EnumService'
import StatusFlowService from '@/services/StatusFlowService'
import WorkflowService from '@/services/WorkflowService'

export default {
  name: 'change-status-process-props',
  mixins: [WorkflowProcessMixin],
  data: function () {
    return {
      adjustmentTypes: [],
      statusItems: [],
      variables: [],
      valueOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        autoCloseBrackets: true,
        line: true,
        mode: 'text/javascript',
        theme: 'eclipse'
      }
    }
  },
  methods: {
    async load () {
      let self = this
      EnumService.enum({
        enumTypeId: 'WorkflowAdjustmentType',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.adjustmentTypes = response.data || []
      })

      WorkflowService.workflowVariables({
        workflowId: this.workflow.workflowId,
        orderByField: 'variableName'
      }).then(function (response) {
        self.variables = response.data.workflowVariableList || []
      })

      StatusFlowService.statusFlowItems({
        statusFlowId: this.workflow.statusFlowId,
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.statusItems = response.data.statusItemList || []
      })
    },
    statusValueChanged (value) {
      for (var i = 0; i < this.statusItems.length; i++) {
        if (this.statusItems[i].statusId === value) {
          this.mutableUserData.statusDescription = this.statusItems[i].description
        }
      }
    },
    variableValueChanged (value) {
      for (var i = 0; i < this.variables.length; i++) {
        if (this.variables[i].variableId === value) {
          this.mutableUserData.variableName = this.variables[i].variableName
        }
      }
    }
  },
  mounted () {
    this.load()
  }
}
</script>
