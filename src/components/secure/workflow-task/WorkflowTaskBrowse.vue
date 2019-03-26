<template>
  <section>
    <h4 class="card-title">Tasks</h4>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <!-- Page Content -->
            <div class="content">
              <b-input-group class="mb-4">
                <b-dropdown v-model="taskTableView" :text="taskTableViewName" slot="prepend">
                  <b-dropdown-item-button v-for="view in taskTableViewOptions" :key="view.id" @click="setTaskTableView(view)">
                    {{ view.name }}
                  </b-dropdown-item-button>
                </b-dropdown>
                <b-form-input v-model="taskTableFilter" placeholder="Filter"/>
                <b-button :disabled="!taskTableFilter || taskTableBusy" @click="taskTableFilter = ''" slot="append">
                  <i class="fas fa-eraser"></i>
                </b-button>
                <b-button :disabled="taskTableBusy" @click="refreshTaskTable" slot="append">
                  <i class="fas fa-sync-alt"></i>
                </b-button>
              </b-input-group>

              <b-table ref="taskTable" bordered striped responsive hover class="mb-4"
                       :busy.sync="taskTableBusy"
                       :items="taskDataProvider"
                       :fields="taskTableFields"
                       :filter="taskTableFilter"
                       :current-page="taskTableCurrentPage"
                       :per-page="taskTablePerPage">
                <template slot="taskId" slot-scope="data">
                  <b-link :to="{name: 'ViewWorkflowTask', params: {id: data.item.taskId}}">{{ data.item.taskId }}</b-link>
                </template>
                <template slot="description" slot-scope="data">
                  {{ data.item.description | prettyNull }}
                </template>
                <template slot="instanceTimeoutDate" slot-scope="data">
                  {{ data.item.instanceTimeoutDate | formatUnixTimestamp }}
                </template>
              </b-table>

              <div class="row">
                <div class="col-sm-12">
                  <div class="float-left">
                    <b-pagination :total-rows="taskTableTotalRows" :per-page="taskTablePerPage" v-model="taskTableCurrentPage"/>
                  </div>
                  <div class="float-right">
                    <b-form-select :options="taskTablePageOptions" v-model="taskTablePerPage" />
                  </div>
                  <div class="float-right mx-2">
                    <div class="form-control text-muted">{{ pagingInfo(taskTableCurrentPage, taskTablePerPage, taskTableTotalRows) }}</div>
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
import WorkflowTaskTableMixin from '@/mixins/WorkflowTaskTableMixin'

export default {
  name: 'workflow-task-browse',
  mixins: [PagingTableMixin, WorkflowTaskTableMixin],
  data: function () {
    return {
      workflowTypeEnumId: 'WF_FT'
    }
  }
}
</script>
