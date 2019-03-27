<template>
  <div>
    <status-flow-modal
            :id="id"
            :title="title"
            :defaultStatusFlowTableFilter="defaultStatusFlowTableFilter"
            :statusTypeId="statusTypeId"
            @select-row="selectRow"/>

    <vue-simple-suggest ref="autoComplete"
                        :list="autoCompleteProvider"
                        value-attribute="statusFlowId"
                        display-attribute="description"
                        :destyled=true
                        :styles="autoCompleteStyles"
                        @select="selectSuggestion">
      <b-input-group>
        <b-form-input type="text" v-model="mutableDescription"/>
        <b-button slot="append" :disabled="!mutableStatusFlowId" @click="clear">
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
import StatusFlowModal from '@/components/secure/status-flow/StatusFlowModal'
import StatusFlowService from '@/services/StatusFlowService'

export default {
  name: 'status-flow-lookup',
  props: {
    statusFlowId: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'statusFlowModal'
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
    defaultStatusFlowTableFilter: {
      type: String,
      default: null
    },
    statusTypeId: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      mutableStatusFlowId: this.statusFlowId,
      mutableDescription: this.description,
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
    StatusFlowModal
  },
  methods: {
    autoCompleteProvider (query) {
      return StatusFlowService.statusFlows({
        pageIndex: 0,
        pageSize: 10,
        orderByField: 'description',
        filter: query,
        statusTypeId: this.statusTypeId
      }).then(function (response) {
        return response.data || []
      })
    },
    clear () {
      this.mutableStatusFlowId = ''
      this.mutableDescription = ''
      this.$refs.autoComplete.clearSuggestions()
      this.$emit('select-record', {})
    },
    selectRow (record, index) {
      this.mutableStatusFlowId = record.statusFlowId
      this.mutableDescription = record.description
      this.$refs.autoComplete.clearSuggestions()
      this.$emit('select-record', record)
    },
    selectSuggestion (suggestion) {
      if (suggestion) {
        this.mutableStatusFlowId = suggestion.statusFlowId
        this.mutableDescription = suggestion.description
        this.$emit('select-record', suggestion)
      }
    }
  },
  watch: {
    statusFlowId: function (val) {
      this.mutableStatusFlowId = val
    },
    description: function (val) {
      this.mutableDescription = val
    },
    statusTypeId: function (newVal, oldVal) {
      if (oldVal) {
        this.clear()
      }
    }
  }
}
</script>
