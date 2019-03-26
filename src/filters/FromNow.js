import moment from 'moment'

export default function fromNow (value) {
  if (value) {
    return moment.unix(value / 1000).fromNow()
  } else {
    return '-'
  }
}
