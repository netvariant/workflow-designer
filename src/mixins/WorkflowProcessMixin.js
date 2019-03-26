let WorkflowProcessMixin = {
  props: {
    workflow: Object,
    userData: Object
  },
  data: function () {
    return {
      mutableUserData: this.userData
    }
  },
  methods: {
    save () {
      this.$emit('save', this.mutableUserData)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}

export default WorkflowProcessMixin
