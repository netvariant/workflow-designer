<template>
  <div>
    <workflow-modal
      :id="id"
      :title="title"
      :defaultWorkflowTypeEnumId="defaultWorkflowTypeEnumId"
      :defaultWorkflowTableFilter="defaultWorkflowTableFilter"
      @select-row="selectRow"/>

    <vue-simple-suggest ref="autoComplete"
      :list="autoCompleteProvider"
      value-attribute="workflowId"
      display-attribute="workflowName"
      :destyled=true
      :styles="autoCompleteStyles"
      @select="selectSuggestion">
      <b-input-group>
        <b-form-input type="text" v-model="mutableWorkflowName"/>
        <b-button slot="append" :disabled="!mutableWorkflowId" @click="clear">
          <i class="fas fa-eraser"></i>
        </b-button>
        <b-button slot="append" v-b-modal="id">
          <i class="fas fa-search"></i>
        </b-button>
      </b-input-group>
    </vue-simple-suggest>
  </div>
</template>

<script>
import WorkflowModal from '@/components/secure/workflow/WorkflowModal'
import WorkflowService from '@/services/WorkflowService'

export default {
  name: 'workflow-lookup',
  props: {
    workflowId: {
      type: String,
      default: null
    },
    workflowName: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'WorkflowModal'
    },
    title: {
      type: String,
      default: null
    },
    minLength: {
      type: Number,
      default: 3
    },
    maxSuggestions: {
      type: Number,
      default: 5
    },
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
      mutableWorkflowId: this.workflowId,
      mutableWorkflowName: this.workflowName,
      autoCompleteStyles: {
        vueSimpleSuggest: 'position-relative',
        inputWrapper: '',
        defaultInput: 'form-control',
        suggestions: 'suggest-list list-group position-absolute',
        suggestItem: 'suggest-list-item list-group-item'
      }
    }
  },
  components: {
    WorkflowModal
  },
  methods: {
    autoCompleteProvider (query) {
      return WorkflowService.workflows({
        pageIndex: 0,
        pageSize: 10,
        orderByField: 'workflowName',
        filter: query,
        workflowTypeEnumId: 'WF_FT'
      }).then(function (response) {
        return response.data.workflowList || []
      })
    },
    clear () {
      this.mutableWorkflowId = ''
      this.mutableWorkflowName = ''
      this.$refs.autoComplete.clearSuggestions()
    },
    selectRow (record, index) {
      this.mutableWorkflowId = record.workflowId
      this.mutableWorkflowName = record.workflowName
      this.$refs.autoComplete.clearSuggestions()
      this.$emit('select-record', record)
    },
    selectSuggestion (suggestion) {
      if (suggestion) {
        this.mutableWorkflowId = suggestion.workflowId
        this.mutableWorkflowName = suggestion.workflowName
        this.$emit('select-record', suggestion)
      }
    }
  },
  watch: {
    workflowId: function (val) {
      this.mutableWorkflowId = val
    },
    workflowName: function (val) {
      this.mutableWorkflowName = val
    }
  }
}
</script>
