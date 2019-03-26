<template>
  <div>
    <b-modal :id="id" ref="modal" :title="title" size="lg" header-bg-variant="dark" header-text-variant="light" body-class="p-0" hide-footer>
      <div class="block-content p-4">
        <b-input-group class="mb-4">
          <b-form-input v-model="statusFlowTableFilter" placeholder="Filter"/>
          <b-button :disabled="!statusFlowTableFilter || statusFlowTableBusy" @click="statusFlowTableFilter = ''" slot="append">
            <i class="fas fa-eraser"></i>
          </b-button>
          <b-button :disabled="statusFlowTableBusy" @click="refreshStatusFlowTable" slot="append">
            <i class="fas fa-sync-alt"></i>
          </b-button>
        </b-input-group>

        <b-table ref="statusFlowTable" bordered striped responsive hover class="mb-4"
                 :busy.sync="statusFlowTableBusy"
                 :items="statusFlowDataProvider"
                 :fields="statusFlowTableFields"
                 :filter="statusFlowTableFilter"
                 :current-page="statusFlowTableCurrentPage"
                 :per-page="statusFlowTablePerPage"
                 @row-clicked="selectRow">
        </b-table>

        <div class="row">
          <div class="col-sm-12">
            <div class="float-left">
              <b-pagination :total-rows="statusFlowTableTotalRows" :per-page="statusFlowTablePerPage" v-model="statusFlowTableCurrentPage"/>
            </div>
            <div class="float-right">
              <b-form-select :options="statusFlowTablePageOptions" v-model="statusFlowTablePerPage" />
            </div>
            <div class="float-right mx-2">
              <div class="form-control text-muted">{{ pagingInfo(statusFlowTableCurrentPage, statusFlowTablePerPage, statusFlowTableTotalRows) }}</div>
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
import StatusFlowTableMixin from '@/mixins/StatusFlowTableMixin'

export default {
  name: 'status-flow-modal',
  mixins: [PagingTableMixin, StatusFlowTableMixin],
  props: {
    id: {
      type: String,
      default: 'statusFlowModal'
    },
    title: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      statusTypeId: 'TransferStatus'
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
