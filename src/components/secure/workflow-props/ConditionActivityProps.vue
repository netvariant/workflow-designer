<template>
  <div>
    <b-form class="mb-4">
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Condition Type</label>
          <b-form-radio-group v-model="mutableUserData.conditionTypeEnumId">
            <b-form-radio v-for="(enumObj, index) in conditionTypes" :key="index" :value="enumObj.enumId">{{ enumObj.description }}</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-form-row>
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Join Operator</label>
          <b-form-radio-group v-model="mutableUserData.joinOperator">
            <b-form-radio value="AND">And</b-form-radio>
            <b-form-radio value="OR">Or</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </b-form-row>
      <b-form-row v-if="mutableUserData.conditionTypeEnumId === 'WF_CONDITION_FIELD'">
        <table class="table table-bordered outlined table-vcenter mb-4">
          <thead class="thead-light">
            <tr>
              <th class="text-center" style="width: 50px;">#</th>
              <th>Field</th>
              <th>Operator</th>
              <th>Value</th>
              <th class="text-center">Options</th>
            </tr>
          </thead>
          <tr v-for="(condition, index) in mutableUserData.conditions" :key="index">
            <td class="text-center">
              {{index + 1}}
            </td>
            <td>
              <b-form-select v-model="condition.fieldName" :options="fields" value-field="fieldName" text-field="displayName"/>
            </td>
            <td>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_TEXT'">
                <b-form-select v-model="condition.operator" :options="textOperators" value-field="enumId" text-field="description"/>
              </template>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_NUMBER'">
                <b-form-select v-model="condition.operator" :options="numberOperators" value-field="enumId" text-field="description"/>
              </template>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_DATE'">
                <b-form-select v-model="condition.operator" :options="dateOperators" value-field="enumId" text-field="description"/>
              </template>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_BOOLEAN'">
                <b-form-select v-model="condition.operator" :options="booleanOperators" value-field="enumId" text-field="description"/>
              </template>
            </td>
            <td>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_TEXT'">
                <b-form-input v-model="condition.value" type="text" :disabled="condition.operator === 'TXT_EMPTY' || condition.operator === 'TXT_NOT_EMPTY'"/>
              </template>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_NUMBER'">
                <b-form-input v-model="condition.value" type="number"/>
              </template>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_DATE'">
                <b-form-input v-model="condition.value" type="date"/>
              </template>
              <template v-if="fieldByName(condition.fieldName).fieldTypeEnumId === 'ENTITY_FLD_BOOLEAN'">
                <b-form-input v-model="condition.value" type="text" :disabled="true"/>
              </template>
            </td>
            <td class="text-center">
              <div class="btn-group">
                <b-button size="sm" @click="deleteCondition(index)" :disabled="index === 0">
                  <i class="fa fa-times"></i>
                </b-button>
                <b-button size="sm" @click="addCondition">
                  <i class="fa fa-plus"></i>
                </b-button>
              </div>
            </td>
          </tr>
        </table>
      </b-form-row>
      <b-form-row v-if="mutableUserData.conditionTypeEnumId === 'WF_CONDITION_VARIABLE'">
        <table class="table table-bordered outlined table-vcenter mb-4">
          <thead class="thead-light">
            <tr>
              <th class="text-center" style="width: 50px;">#</th>
              <th>Variable</th>
              <th>Operator</th>
              <th>Value</th>
              <th class="text-center">Options</th>
            </tr>
          </thead>
          <tr v-for="(condition, index) in mutableUserData.conditions" :key="index">
            <td class="text-center">
              {{index + 1}}
            </td>
            <td>
              <b-form-select v-model="condition.variableName" :options="variables" value-field="variableName" text-field="variableName"/>
            </td>
            <td>
              <template v-if="variableByName(condition.variableName).variableTypeEnumId === 'WF_VAR_TEXT'">
                <b-form-select v-model="condition.operator" :options="textOperators" value-field="enumId" text-field="description"/>
              </template>
              <template v-if="variableByName(condition.variableName).variableTypeEnumId === 'WF_VAR_NUMBER'">
                <b-form-select v-model="condition.operator" :options="numberOperators" value-field="enumId" text-field="description"/>
              </template>
            </td>
            <td>
              <template v-if="variableByName(condition.variableName).variableTypeEnumId === 'WF_VAR_TEXT'">
                <b-form-input v-model="condition.value" type="text" :disabled="condition.operator === 'TXT_EMPTY' || condition.operator === 'TXT_NOT_EMPTY'"/>
              </template>
              <template v-if="variableByName(condition.variableName).variableTypeEnumId === 'WF_VAR_NUMBER'">
                <b-form-input v-model="condition.value" type="number"/>
              </template>
            </td>
            <td class="text-center">
              <div class="btn-group">
                <b-button size="sm" @click="deleteCondition(index)" :disabled="index === 0">
                  <i class="fa fa-times"></i>
                </b-button>
                <b-button size="sm" @click="addCondition">
                  <i class="fa fa-plus"></i>
                </b-button>
              </div>
            </td>
          </tr>
        </table>
      </b-form-row>
      <b-form-row v-if="mutableUserData.conditionTypeEnumId === 'WF_CONDITION_SCRIPT'">
        <table class="table table-bordered outlined table-vcenter mb-4">
          <thead class="thead-light">
            <tr>
              <th class="text-center" style="width: 50px;">#</th>
              <th>Script</th>
              <th class="text-center">Options</th>
            </tr>
          </thead>
          <tr v-for="(condition, index) in mutableUserData.conditions" :key="index">
            <td class="text-center">
              {{index + 1}}
            </td>
            <td>
              <div class="code-editor">
                <codemirror v-model="condition.script" :options="scriptOptions" class="workflow-code-editor"></codemirror>
              </div>
            </td>
            <td class="text-center">
              <div class="btn-group">
                <b-button size="sm" @click="deleteCondition(index)" :disabled="index === 0">
                  <i class="fa fa-times"></i>
                </b-button>
                <b-button size="sm" @click="addCondition">
                  <i class="fa fa-plus"></i>
                </b-button>
              </div>
            </td>
          </tr>
        </table>
      </b-form-row>

      <b-button @click="save" class="mr-2" variant="primary">Save</b-button>
      <b-button @click="cancel" class="mr-2">Cancel</b-button>
    </b-form>
  </div>
</template>

<script>
import WorkflowProcessMixin from '@/mixins/WorkflowProcessMixin'
import EntityFieldService from '@/services/EntityFieldService'
import EnumService from '@/services/EnumService'
import WorkflowService from '@/services/WorkflowService'

export default {
  name: 'condition-activity-props',
  mixins: [WorkflowProcessMixin],
  data () {
    return {
      conditionTypes: [],
      fields: [],
      variables: [],
      textOperators: [],
      numberOperators: [],
      dateOperators: [],
      booleanOperators: [],
      scriptOptions: {
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
        enumTypeId: 'WorkflowConditionType',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.conditionTypes = response.data || []
      })

      EnumService.enum({
        enumTypeId: 'TextComparisonOperator',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.textOperators = response.data || []
      })

      EnumService.enum({
        enumTypeId: 'NumberComparisonOperator',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.numberOperators = response.data || []
      })

      EnumService.enum({
        enumTypeId: 'DateComparisonOperator',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.dateOperators = response.data || []
      })

      EnumService.enum({
        enumTypeId: 'BooleanComparisonOperator',
        orderByField: 'sequenceNum,description'
      }).then(function (response) {
        self.booleanOperators = response.data || []
      })

      EntityFieldService.entityFields({
        entityName: this.workflow.primaryViewEntityName,
        orderByField: 'fieldName'
      }).then(function (response) {
        self.fields = response.data || []
        if (self.mutableUserData.conditions.length === 0) {
          self.addCondition()
        }
      })

      WorkflowService.workflowVariables({
        workflowId: this.workflow.workflowId,
        orderByField: 'variableName'
      }).then(function (response) {
        self.variables = response.data.workflowVariableList || []
      })
    },
    fieldByName (fieldName) {
      for (let i = 0; i < this.fields.length; i++) {
        if (this.fields[i].fieldName === fieldName) {
          return this.fields[i]
        }
      }
      return {}
    },
    variableByName (variableName) {
      for (let i = 0; i < this.variables.length; i++) {
        if (this.variables[i].variableName === variableName) {
          return this.variables[i]
        }
      }
      return {}
    },
    addCondition () {
      if (this.mutableUserData.conditionTypeEnumId === 'WF_CONDITION_FIELD') {
        let field = this.fields[0]
        if (field) {
          let fieldName = field.fieldName
          let fieldTypeEnumId = field.fieldTypeEnumId
          let operator = fieldTypeEnumId === 'ENTITY_FLD_DATE' ? this.dateOperators[0].value : (fieldTypeEnumId === 'ENTITY_FLD_NUMBER' ? this.numberOperators[0].value : this.textOperators[0].value)
          this.mutableUserData.conditions.push({
            fieldName: fieldName,
            operator: operator,
            value: ''
          })
        }
      } else if (this.mutableUserData.conditionTypeEnumId === 'WF_CONDITION_VARIABLE') {
        let variable = this.variables[0]
        if (variable) {
          let variableName = variable.variableName
          let variableTypeEnumId = variable.variableTypeEnumId
          let operator = variableTypeEnumId === 'WF_VAR_TEXT' ? this.numberOperators[0].value : this.textOperators[0].value
          this.mutableUserData.conditions.push({
            variableName: variableName,
            operator: operator,
            value: ''
          })
        }
      } else if (this.mutableUserData.conditionTypeEnumId === 'WF_CONDITION_SCRIPT') {
        this.mutableUserData.conditions.push({
          script: ''
        })
      }
    },
    deleteCondition (index) {
      this.mutableUserData.conditions.splice(index, 1)
    },
    resetConditions () {
      this.mutableUserData.conditions = []
      this.addCondition()
    }
  },
  mounted () {
    this.load()
  },
  watch: {
    'mutableUserData.conditionTypeEnumId': function (val) {
      this.resetConditions()
    }
  }
}
</script>
