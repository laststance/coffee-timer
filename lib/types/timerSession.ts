/**
 * Timer session as returned from the API.
 *
 * @example
 * { id: 'abc123', userId: 'usr_1', durationSeconds: 300, completedAt: '2026-02-16T09:30:00Z', soundPreset: 'ascending-chime', note: null }
 */
export interface TimerSessionRecord {
  id: string
  userId: string
  durationSeconds: number
  completedAt: string
  soundPreset: string
  note: string | null
  createdAt: string
  updatedAt: string
}
