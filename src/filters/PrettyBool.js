export default function prettyBool (value) {
  if (value === 'Y' || value === '1') {
    return 'Yes'
  } else {
    return 'No'
  }
}
