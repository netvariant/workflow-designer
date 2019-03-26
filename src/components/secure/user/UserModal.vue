<template>
  <div>
    <b-modal :id="id" ref="modal" :title="title" size="lg" header-bg-variant="dark" header-text-variant="light" body-class="p-0" hide-footer>
      <div class="block-content p-4">
        <b-input-group class="mb-4">
          <b-form-input v-model="userTableFilter" placeholder="Filter"/>
          <b-button :disabled="!userTableFilter || userTableBusy" @click="userTableFilter = ''" slot="append">
            <i class="fa fa-eraser"></i>
          </b-button>
          <b-button :disabled="userTableBusy" @click="refreshUserTable" slot="append">
            <i class="fas fa-sync-alt"></i>
          </b-button>
        </b-input-group>

        <b-table ref="userTable" striped responsive hover class="mb-4"
                 :busy.sync="userTableBusy"
                 :items="userDataProvider"
                 :fields="userTableFields"
                 :filter="userTableFilter"
                 :current-page="userTableCurrentPage"
                 :per-page="userTablePerPage"
                 @row-clicked="selectRow">
        </b-table>

        <div class="row">
          <div class="col-md-6">
            <div class="float-left">
              <b-pagination :total-rows="userTableTotalRows" :per-page="userTablePerPage" v-model="userTableCurrentPage"/>
            </div>
          </div>
          <div class="col-md-6 mt-2 mt-sm-0">
            <div class="float-right">
              <b-form-select :options="userTablePageOptions" v-model="userTablePerPage" />
            </div>
            <div class="float-right mx-2">
              <div class="form-control text-muted">{{ pagingInfo(userTableCurrentPage, userTablePerPage, userTableTotalRows) }}</div>
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
import UserTableMixin from '@/mixins/UserTableMixin'

export default {
  name: 'user-modal',
  mixins: [PagingTableMixin, UserTableMixin],
  props: {
    id: {
      type: String,
      default: 'userModal'
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
