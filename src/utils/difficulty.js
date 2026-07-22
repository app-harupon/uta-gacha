import { SONGS } from '../data/songs'

const allScores = SONGS.map((s) => s.diff).sort((a, b) => a - b)

// 全曲のスコア(男女どちらも合わせた分布)を10等分(パーセンタイル)し、
// レベル1〜9それぞれの「この値以下ならこのレベル」という上限スコアを動的に算出する。
// 単純な絶対値ベースの区切りだと中間の難易度帯に曲が偏ってしまうため、
// 順位ベースで各レベルにほぼ均等(約1/10ずつ)に曲が振り分けられるようにしている。
// 曲を追加/削除すると自動的に再計算されるので、手動でしきい値を調整する必要はない。
const LEVEL_BOUNDARIES = Array.from({ length: 9 }, (_, i) => {
  const idx = Math.floor((allScores.length * (i + 1)) / 10)
  return allScores[idx]
})

export function scoreToLevel(score) {
  for (let i = 0; i < LEVEL_BOUNDARIES.length; i++) {
    if (score <= LEVEL_BOUNDARIES[i]) return i + 1
  }
  return 10
}

export function difficultyTag(level) {
  if (level <= 2) return 'やさしめ'
  if (level <= 4) return 'ふつう'
  if (level <= 6) return 'ちょい難'
  if (level <= 8) return '難関'
  return '激ムズ'
}
