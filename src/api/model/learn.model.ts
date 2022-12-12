import { ApiResp, ApiRespList } from '../types'

export type LiveRoomResp = ApiResp<LiveRoomData>

export interface LiveRoomData {
  webUrl: string
  liveToolType: string
  liveRoomId: string
  liveRoomNumber?: any
  outUserId?: any
  ccSessionId: string
  ccRoomType: string
  ccUserId: string
  ccRoomResolution: string
  ccTemplatetype: string
  ccLayoutMode: string
  ccPassword: string
  pid: string
}
