<template>
  <div>
    <b-form class="mb-4">
      <b-form-row>
        <b-form-group class="col-md-12">
          <label>Result Code</label>
          <b-form-input v-model="mutableUserData.resultCode" type="number"/>
        </b-form-group>
      </b-form-row>

      <b-button @click="save" class="mr-2" variant="primary">Save</b-button>
      <b-button @click="cancel" class="mr-2">Cancel</b-button>
    </b-form>
  </div>
</template>

<script>
import WorkflowProcessMixin from '@/mixins/WorkflowProcessMixin'

export default {
  name: 'exit-activity-props',
  mixins: [WorkflowProcessMixin]
}
</script>
