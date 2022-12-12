import { ApiResp } from '../types'

export type AccountDurationtResp = ApiResp<AccountDurationtData>

export interface AccountDurationtData {
  durationType: number
  durationStr: string
}
