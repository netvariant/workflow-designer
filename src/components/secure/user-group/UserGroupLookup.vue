<template>
  <div>
    <user-group-modal
      :id="id"
      :title="title"
      :defaultUserGroupTableFilter="defaultUserGroupTableFilter"
      @select-row="selectRow"/>

    <vue-simple-suggest ref="autoComplete"
      :list="autoCompleteProvider"
      value-attribute="userGroupId"
      display-attribute="description"
      :destyled=true
      :styles="autoCompleteStyles"
      @select="selectSuggestion">
      <b-input-group>
        <b-form-input type="text" v-model="mutableDescription"/>
        <b-button slot="append" :disabled="!mutableUserGroupId" @click="clear">
          <i class="fa fa-eraser"></i>
        </b-button>
        <b-button slot="append" v-b-modal="id">
          <i class="fa fa-search"></i>
        </b-button>
      </b-input-group>
    </vue-simple-suggest>
  </div>
</template>

<script>
import UserGroupModal from '@/components/secure/user-group/UserGroupModal'
import SecurityService from '@/services/SecurityService'
import AutoCompleteMixin from '@/mixins/AutoCompleteMixin'

export default {
  name: 'user-group-lookup',
  mixins: [AutoCompleteMixin],
  props: {
    userGroupId: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'userGroupModal'
    },
    title: {
      type: String,
      default: null
    },
    defaultUserGroupTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      mutableUserGroupId: this.userGroupId,
      mutableDescription: this.description
    }
  },
  components: {
    UserGroupModal
  },
  methods: {
    autoCompleteProvider (query) {
      return SecurityService.userGroups({
        pageIndex: 0,
        pageSize: 10,
        orderByField: 'description',
        filter: query
      }).then((response) => {
        return response.data.userGroupList || []
      })
    },
    clear () {
      this.mutableUserGroupId = ''
      this.mutableDescription = ''
      this.$refs.autoComplete.clearSuggestions()
    },
    selectRow (record, index) {
      this.mutableUserGroupId = record.userGroupId
      this.mutableDescription = record.description
      this.$refs.autoComplete.clearSuggestions()
      this.$emit('select-record', record)
    },
    selectSuggestion (suggestion) {
      if (suggestion) {
        this.mutableUserGroupId = suggestion.userGroupId
        this.mutableDescription = suggestion.description
        this.$emit('select-record', suggestion)
      }
    }
  },
  watch: {
    userGroupId: function (val) {
      this.mutableUserGroupId = val
    },
    description: function (val) {
      this.mutableDescription = val
    }
  }
}
</script>
