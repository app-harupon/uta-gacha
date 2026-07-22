import { SONGS } from '../data/songs'

const allScores = SONGS.flatMap((s) => [s.diffMale, s.diffFemale])
const SCORE_MIN = Math.min(...allScores)
const SCORE_MAX = Math.max(...allScores)

// 生スコア(0〜10、0.1刻み)を、実際のデータセットの最小〜最大値をもとに
// レベル1〜10へ再スケールする。単純な四捨五入だとレベル1・10がほぼ空になってしまうため、
// レベル1の基準を引き上げ・レベル10の基準を引き下げて全レベルに曲が行き渡るようにしている。
export function scoreToLevel(score) {
  const raw = 1 + ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 9
  return Math.max(1, Math.min(10, Math.round(raw)))
}

export function difficultyTag(level) {
  if (level <= 2) return 'やさしめ'
  if (level <= 4) return 'ふつう'
  if (level <= 6) return 'ちょい難'
  if (level <= 8) return '難関'
  return '激ムズ'
}
