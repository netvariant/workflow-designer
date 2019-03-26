let WorkflowCrowdProcessMixin = {
  data () {
    return {
      crowdTypeEnumId: 'WF_CROWD_USER',
      userId: '',
      userFullName: '',
      userGroupId: '',
      userGroupDescription: ''
    }
  },
  methods: {
    crowdName (crowd) {
      if (crowd.crowdTypeEnumId === 'WF_CROWD_USER') {
        return crowd.userFullName
      } else if (crowd.crowdTypeEnumId === 'WF_CROWD_USER_GROUP') {
        return crowd.userGroupDescription
      } else {
        return 'Initiator'
      }
    },
    selectUserRecord (record) {
      this.userId = record.userId
      this.userFullName = record.userFullName
    },
    selectUserGroupRecord (record) {
      this.userGroupId = record.userGroupId
      this.userGroupDescription = record.description
    }
  }
}

export default WorkflowCrowdProcessMixin
