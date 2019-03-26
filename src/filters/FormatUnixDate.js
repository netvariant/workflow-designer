import moment from 'moment'

export default function formatUnixDate (value) {
  if (value) {
    return moment.unix(value / 1000).format('DD-MM-YYYY')
  } else {
    return '-'
  }
}
