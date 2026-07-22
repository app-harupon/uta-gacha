import { useState } from 'react'
import { difficultyTag, scoreToLevel } from '../utils/difficulty'
import { loadRecord, saveRecord } from '../utils/storage'

const AXES = [
  { key: 'pitch', label: '音域', max: 5.0 },
  { key: 'rhythm', label: 'リズム', max: 2.0 },
  { key: 'breath', label: 'ブレス', max: 1.5 },
  { key: 'expression', label: '表現力', max: 1.5 },
]

export default function SongCard({ song, genderKey }) {
  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState(() => loadRecord(song.title, song.artist))
  const [scoreInput, setScoreInput] = useState(record?.score ?? '')
  const [memoInput, setMemoInput] = useState(record?.memo ?? '')

  const score = genderKey === 'male' ? song.diffMale : song.diffFemale
  const level = scoreToLevel(score)
  const tag = difficultyTag(level)

  const axisValue = (key) => {
    if (key === 'pitch') {
      return genderKey === 'male' ? song.breakdown.pitchMale : song.breakdown.pitchFemale
    }
    return song.breakdown[key]
  }

  const handleSave = () => {
    const parsed = scoreInput === '' ? null : Number(scoreInput)
    saveRecord(song.title, song.artist, { score: parsed, memo: memoInput })
    setRecord({ score: parsed, memo: memoInput })
  }

  return (
    <div className="song-card">
      <button className="song-card-header" onClick={() => setOpen((v) => !v)}>
        <div className="song-card-title-block">
          <div className="song-title">{song.title}</div>
          <div className="song-artist">{song.artist}</div>
          <div className="song-meta">
            {song.genre} / {song.era}
          </div>
        </div>
        <div className="song-score-block">
          <div className="led-score">
            {level}
            <span className="led-score-max">/10</span>
          </div>
          <div className={`diff-tag diff-tag-${tag}`}>{tag}</div>
        </div>
      </button>

      {open && (
        <div className="song-card-detail">
          <div className="breakdown">
            {AXES.map((axis) => {
              const value = axisValue(axis.key)
              const isOverflow = value > axis.max
              return (
                <div className="breakdown-row" key={axis.key}>
                  <span className="breakdown-label">{axis.label}</span>
                  <div className="breakdown-bar-track">
                    <div
                      className={isOverflow ? 'breakdown-bar-fill breakdown-bar-fill-overflow' : 'breakdown-bar-fill'}
                      style={{ width: `${Math.min(100, (value / axis.max) * 100)}%` }}
                    />
                  </div>
                  <span className={isOverflow ? 'breakdown-value breakdown-value-overflow' : 'breakdown-value'}>
                    {value.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="song-comment">{song.comment}</p>

          {record && (
            <p className="prev-record">
              前回の記録: {record.score !== null && record.score !== undefined ? `${record.score}点` : '未採点'}
              {record.memo ? ` / ${record.memo}` : ''}
            </p>
          )}

          <div className="record-form">
            <label>
              自分の点数
              <input
                type="number"
                step="0.1"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                placeholder="例: 85"
              />
            </label>
            <label>
              メモ
              <textarea
                value={memoInput}
                onChange={(e) => setMemoInput(e.target.value)}
                placeholder="気づいたことを書いておこう"
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              保存
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
