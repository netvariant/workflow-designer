let DisabledClassMixin = {
  methods: {
    disabledClass (item) {
      return item.disabled === 'Y' ? 'line-through' : ''
    }
  }
}

export default DisabledClassMixin
