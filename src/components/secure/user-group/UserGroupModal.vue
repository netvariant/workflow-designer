<template>
  <div>
    <b-modal :id="id" ref="modal" :title="title" size="lg" header-bg-variant="dark" header-text-variant="light" body-class="p-0" hide-footer>
      <div class="block-content p-4">
        <b-input-group class="mb-4">
          <b-form-input v-model="userGroupTableFilter" placeholder="Filter"/>
          <b-button :disabled="!userGroupTableFilter || userGroupTableBusy" @click="userGroupTableFilter = ''" slot="append">
            <i class="fa fa-eraser"></i>
          </b-button>
          <b-button :disabled="userGroupTableBusy" @click="refreshUserGroupTable" slot="append">
            <i class="fas fa-sync-alt"></i>
          </b-button>
        </b-input-group>

        <b-table ref="userGroupTable" striped responsive hover class="mb-4"
                 :busy.sync="userGroupTableBusy"
                 :items="userGroupDataProvider"
                 :fields="userGroupTableFields"
                 :filter="userGroupTableFilter"
                 :current-page="userGroupTableCurrentPage"
                 :per-page="userGroupTablePerPage"
                 @row-clicked="selectRow">
        </b-table>

        <div class="row">
          <div class="col-md-6">
            <div class="float-left">
              <b-pagination :total-rows="userGroupTableTotalRows" :per-page="userGroupTablePerPage" v-model="userGroupTableCurrentPage"/>
            </div>
          </div>
          <div class="col-md-6 mt-2 mt-sm-0">
            <div class="float-right">
              <b-form-select :options="userGroupTablePageOptions" v-model="userGroupTablePerPage" />
            </div>
            <div class="float-right mx-2">
              <div class="form-control text-muted">{{ pagingInfo(userGroupTableCurrentPage, userGroupTablePerPage, userGroupTableTotalRows) }}</div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import PagingTableMixin from '@/mixins/PagingTableMixin'
import UserGroupTableMixin from '@/mixins/UserGroupTableMixin'

export default {
  name: 'user-group-modal',
  mixins: [PagingTableMixin, UserGroupTableMixin],
  props: {
    id: {
      type: String,
      default: 'userGroupModal'
    },
    title: {
      type: String,
      default: null
    }
  },
  methods: {
    selectRow (record, index) {
      this.$emit('select-row', record, index)
      this.$refs.modal.hide()
    }
  }
}
</script>
