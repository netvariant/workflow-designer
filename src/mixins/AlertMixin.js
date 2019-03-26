let AlertMixin = {
  data: function () {
    return {
      alertDisplaySeconds: 10,
      alertCountDown: 0,
      alertMessage: 'An unknown error has occurred.',
      alertVariant: 'danger'
    }
  },
  methods: {
    alertCountDownChanged (alertCountDown) {
      this.alertCountDown = alertCountDown
    },
    showAlert (variant, message) {
      this.alertMessage = message || 'An unknown error has occurred.'
      this.alertVariant = variant
      this.alertCountDown = this.alertDisplaySeconds
    },
    showSuccessAlert (message) {
      this.showAlert('success', message)
    },
    showDangerAlert (message) {
      this.showAlert('danger', message)
    },
    showWarningAlert (message) {
      this.showAlert('warning', message)
    },
    showInfoAlert (message) {
      this.showAlert('info', message)
    }
  }
}

export default AlertMixin
