<template>
  <section>
    <h4 class="card-title">Create Workflow</h4>
    <div class="row">
      <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <b-alert :show="alertCountDown" dismissible :variant="alertVariant" @dismissed="alertCountDown=0" @dismiss-count-down="alertCountDownChanged" class="mb-4">
              <p>{{ alertMessage }}</p>
              <b-progress :variant="alertVariant" :max="alertDisplaySeconds" :value="alertCountDown" height="4px"/>
            </b-alert>

            <div class="element-box">
              <div class="steps-w">
                <div class="step-triggers">
                  <a class="step-trigger active" href="#stepContent1" @click="activeTab = 1">General</a>
                  <a class="step-trigger" href="#stepContent2" @click="finalStep">Reminders</a>
                </div>
                <div class="step-contents">
                  <div class="step-content active" id="stepContent1">
                    <b-form>
                      <b-form-row>
                        <b-form-group class="col-md-12">
                          <label>Workflow Name</label>
                          <b-form-input v-model="workflowName"/>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group class="col-md-6">
                          <label>Workflow Type</label>
                          <b-form-select v-model="workflowTypeId">
                            <option v-for="(workflowType, index) in workflowTypes" :key="index" :value="workflowType.typeId">{{ workflowType.typeName }}</option>
                          </b-form-select>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                          <label>Status Flow</label>
                          <status-flow-lookup title="Status Flow" @select-record="selectStatusFlowRecord"/>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group class="col-md-12">
                          <label>Description</label>
                          <b-form-textarea v-model="description" :rows="4"/>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group class="col-md-12">
                          <b-form-checkbox v-model="disabled">Disabled</b-form-checkbox>
                        </b-form-group>
                      </b-form-row>
                    </b-form>
                  </div>

                  <div class="step-content" id="stepContent2">
                    <b-form>
                      <b-form-row>
                        <b-form-group class="col-md-6">
                          <label>Reminder Interval</label>
                          <b-form-input v-model="reminderInterval" type="number"/>
                        </b-form-group>
                        <b-form-group class="col-md-6">
                          <label>&nbsp;</label>
                          <b-form-select v-model="reminderIntervalUomId">
                            <option v-for="(interval, index) in timeIntervals" :key="index" :value="interval.uomId">{{ interval.description }}</option>
                          </b-form-select>
                        </b-form-group>
                      </b-form-row>
                      <b-form-row>
                        <b-form-group class="col-md-12">
                          <label>Reminder Limit</label>
                          <b-form-input v-model="reminderLimit" type="number"/>
                        </b-form-group>
                      </b-form-row>
                    </b-form>
                  </div>
                </div>
                <b-button-toolbar class="form-buttons-w">
                  <b-button @click="cancel" class="mr-2" variant="secondary">
                    <i class="fas fa-times"></i> Cancel
                  </b-button>
                  <b-button @click="previousTab" class="ml-2" variant="primary" v-if="activeTab > 1">
                    Previous
                  </b-button>
                  <div class="h-flex-space"></div>
                  <b-button @click="nextTab" class="ml-2" variant="primary" v-if="activeTab < tabCount">
                    Next
                  </b-button>
                  <b-button @click="createWorkflow" class="ml-2" variant="primary" v-if="activeTab === tabCount">
                    <i class="fas fa-check"></i> Finish
                  </b-button>
                </b-button-toolbar>
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
import AlertMixin from '@/mixins/AlertMixin'
import WorkflowService from '@/services/WorkflowService'
import WorkflowTypeService from '@/services/WorkflowTypeService'
import UomService from '@/services/UomService'
import StatusFlowLookup from '@/components/secure/status-flow/StatusFlowLookup'
import main from '@/assets/js/main'
import $ from 'jquery'

export default {
  name: 'workflow-create',
  mixins: [AlertMixin],
  components: {
    StatusFlowLookup
  },
  data: function () {
    return {
      activeTab: 1,
      tabCount: 2,
      timeIntervals: [],
      workflowName: '',
      workflowTypes: [],
      workflowTypeId: '',
      statusFlowId: '',
      reminderInterval: 0,
      reminderIntervalUomId: 'TF_hr',
      reminderLimit: 0,
      description: '',
      disabled: false
    }
  },
  methods: {
    async load () {
      let self = this
      WorkflowTypeService.workflowTypes({
        orderByField: 'typeName'
      }).then(function (response) {
        self.workflowTypes = response.data.workflowTypeList || []
        self.workflowTypeId = self.workflowTypes[0].typeId
      })

      UomService.uom({
        uomTypeEnumId: 'UT_TIME_FREQ_MEASURE',
        orderByField: 'description'
      }).then(function (response) {
        self.timeIntervals = response.data || []
      })
    },
    nextTab () {
      this.activeTab++
      let tabId = '#stepContent' + this.activeTab
      $('.step-trigger[href="' + tabId + '"]').click()
    },
    previousTab () {
      this.activeTab--
      let tabId = '#stepContent' + this.activeTab
      $('.step-trigger[href="' + tabId + '"]').click()
    },
    finalStep (event) {
      let self = event.target
      let prevTrigger = $(self).prev('.step-trigger')
      if (prevTrigger.length && (prevTrigger.hasClass('active') || prevTrigger.hasClass('complete'))) {
        this.activeTab = 2
      }
    },
    selectStatusFlowRecord (record) {
      this.statusFlowId = record.statusFlowId
    },
    createWorkflow () {
      let self = this
      WorkflowService.createWorkflow({
        launchTypeEnumId: 'WF_LAUNCH_TRIGGER',
        workflowTypeId: this.workflowTypeId,
        workflowName: this.workflowName,
        description: this.description,
        statusFlowId: this.statusFlowId,
        disabled: this.disabled ? 'Y' : 'N',
        reminderInterval: this.reminderInterval,
        reminderIntervalUomId: this.reminderIntervalUomId,
        reminderLimit: this.reminderLimit
      }).then(function (response) {
        if (response.status === 200) {
          self.$router.push({ name: 'BrowseWorkflows' })
        }
      }).catch(function (error) {
        self.showDangerAlert(error.response.data.errors)
      })
    },
    cancel () {
      this.$router.go(-1)
    }
  },
  mounted: function () {
    main.form_steps_trigger_v2()
    this.load()
  }
}
</script>
