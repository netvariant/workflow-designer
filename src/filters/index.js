import prettyNull from './PrettyNull.js'
import prettyBool from './PrettyBool.js'
import formatUnixDate from './FormatUnixDate.js'
import formatUnixTimestamp from './FormatUnixTimestamp.js'
import fromNow from './FromNow.js'

export default {
  install (Vue) {
    Vue.filter('prettyNull', prettyNull)
    Vue.filter('prettyBool', prettyBool)
    Vue.filter('formatUnixDate', formatUnixDate)
    Vue.filter('formatUnixTimestamp', formatUnixTimestamp)
    Vue.filter('fromNow', fromNow)
  }
}
