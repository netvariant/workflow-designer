<template>
  <div>
    <user-modal
      :id="id"
      :title="title"
      :defaultUserTableFilter="defaultUserTableFilter"
      @select-row="selectRow"/>

    <vue-simple-suggest ref="autoComplete"
      :list="autoCompleteProvider"
      value-attribute="userId"
      display-attribute="userFullName"
      :destyled=true
      :styles="autoCompleteStyles"
      @select="selectSuggestion">
      <b-input-group>
        <b-form-input type="text" v-model="mutableUserFullName"/>
        <b-button slot="append" :disabled="!mutableUserId" @click="clear">
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
import UserModal from '@/components/secure/user/UserModal'
import SecurityService from '@/services/SecurityService'
import AutoCompleteMixin from '@/mixins/AutoCompleteMixin'

export default {
  name: 'user-lookup',
  mixins: [AutoCompleteMixin],
  props: {
    userId: {
      type: String,
      default: null
    },
    userFullName: {
      type: String,
      default: null
    },
    id: {
      type: String,
      default: 'userModal'
    },
    title: {
      type: String,
      default: null
    },
    defaultUserTableFilter: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      mutableUserId: this.userId,
      mutableUserFullName: this.userFullName
    }
  },
  components: {
    UserModal
  },
  methods: {
    autoCompleteProvider (query) {
      return SecurityService.users({
        pageIndex: 0,
        pageSize: 10,
        orderByField: 'userFullName',
        filter: query
      }).then((response) => {
        return response.data.userList || []
      })
    },
    clear () {
      this.mutableUserId = ''
      this.mutableUserFullName = ''
      this.$refs.autoComplete.clearSuggestions()
    },
    selectRow (record, index) {
      this.mutableUserId = record.userId
      this.mutableUserFullName = record.userFullName
      this.$refs.autoComplete.clearSuggestions()
      this.$emit('select-record', record)
    },
    selectSuggestion (suggestion) {
      if (suggestion) {
        this.mutableUserId = suggestion.userId
        this.mutableUserFullName = suggestion.userFullName
        this.$emit('select-record', suggestion)
      }
    }
  },
  watch: {
    userId: function (val) {
      this.mutableUserId = val
    },
    userFullName: function (val) {
      this.mutableUserFullName = val
    }
  }
}
</script>
