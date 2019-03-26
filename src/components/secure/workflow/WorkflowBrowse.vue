<template>
  <section>
    <h4 class="card-title">Workflows</h4>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <!-- Page Content -->
            <div class="content">
              <b-button-toolbar class="mb-4">
                <b-button @click="add" class="mr-2" variant="primary">
                  <i class="fas fa-plus-circle"></i> Add
                </b-button>
              </b-button-toolbar>

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
              :per-page="workflowTablePerPage">
              <template slot="workflowId" slot-scope="data">
                <b-link :to="{name: 'ViewWorkflow', params: {id: data.item.workflowId}}">{{ data.item.workflowId }}</b-link>
              </template>
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
          <!-- END Page Content -->
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
import PagingTableMixin from '@/mixins/PagingTableMixin'
import WorkflowTableMixin from '@/mixins/WorkflowTableMixin'

export default {
  name: 'workflow-browse',
  mixins: [PagingTableMixin, WorkflowTableMixin],
  methods: {
    add () {
      this.$router.push({ name: 'CreateWorkflow' })
    }
  }
}
</script>
