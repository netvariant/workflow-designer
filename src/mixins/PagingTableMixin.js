let PagingTableMixin = {
  methods: {
    pagingInfo (pageIndex, pageSize, totalRows) {
      let displayedRow
      if (totalRows <= pageSize) {
        displayedRow = totalRows
      } else {
        let startIndex = (pageIndex - 1) * pageSize + 1
        let endIndex = startIndex + pageSize - 1
        if (endIndex >= totalRows) {
          displayedRow = startIndex + '-' + totalRows
        } else {
          displayedRow = startIndex + '-' + endIndex
        }
      }
      return 'Showing ' + displayedRow + ' of ' + totalRows
    }
  }
}

export default PagingTableMixin
