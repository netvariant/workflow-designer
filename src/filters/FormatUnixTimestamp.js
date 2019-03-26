import moment from 'moment'

export default function formatUnixTimestamp (value) {
  if (value) {
    return moment.unix(value / 1000).format('DD-MM-YYYY h:mm:ss a')
  } else {
    return '-'
  }
}
