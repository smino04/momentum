function hasBatchim(char) {
  const code = char.charCodeAt(0) - 0xac00
  if (code < 0 || code > 11171) return false
  return code % 28 !== 0
}

export function josa(word, withBatchim, withoutBatchim) {
  if (!word) return withoutBatchim
  const lastChar = word[word.length - 1]
  return hasBatchim(lastChar) ? withBatchim : withoutBatchim
}
