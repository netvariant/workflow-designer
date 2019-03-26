<template>
  <div>
    <b-modal :id="id" ref="modal" :title="title" size="lg" header-bg-variant="dark" header-text-variant="light" body-class="p-0" hide-footer>
      <div class="block-content p-4">
        <b-input-group class="mb-4">
          <b-form-input v-model="workflowTableFilter" placeholder="Filter"/>
          <b-button :disabled="!workflowTableFilter || workflowTableBusy" @click="workflowTableFilter = ''" slot="append">
            <i class="fas fa-eraser"></i>
          </b-button>
          <b-button :disabled="workflowTableBusy" @click="refreshWorkflowTable" slot="append">
            <i class="fas fa-sync-alt"></i>
          </b-button>
        </b-input-group>

        <b-table ref="workflowTable" bordered striped responsive hover class="mb-4"
                 :busy.sync="workflowTableBusy"
                 :items="workflowDataProvider"
                 :fields="workflowTableFields"
                 :filter="workflowTableFilter"
                 :current-page="workflowTableCurrentPage"
                 :per-page="workflowTablePerPage"
                 @row-clicked="selectRow">
          <template slot="workflowName" slot-scope="data">
            <span :class="workflowStatusClass(data.item)">{{ data.item.workflowName }}</span>
          </template>
          <template slot="description" slot-scope="data">
            {{ data.item.description | prettyNull }}
          </template>
        </b-table>

        <div class="row">
          <div class="col-sm-12">
            <div class="float-left">
              <b-pagination :total-rows="workflowTableTotalRows" :per-page="workflowTablePerPage" v-model="workflowTableCurrentPage"/>
            </div>
            <div class="float-right">
              <b-form-select :options="workflowTablePageOptions" v-model="workflowTablePerPage" />
            </div>
            <div class="float-right mx-2">
              <div class="form-control text-muted">{{ pagingInfo(workflowTableCurrentPage, workflowTablePerPage, workflowTableTotalRows) }}</div>
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
import WorkflowTableMixin from '@/mixins/WorkflowTableMixin'

export default {
  name: 'workflow-modal',
  mixins: [PagingTableMixin, WorkflowTableMixin],
  props: {
    id: {
      type: String,
      default: 'WorkflowModal'
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
