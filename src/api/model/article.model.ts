import { ApiResp, ApiRespList } from '../types'

export type ArticleListResp = ApiRespList<ArticleData[]>

export interface ArticleData {
  postId: number
  title: string
  imgUrl: string
  imgUrlList?: any
  createTime: string
  userName: string
  readNum: number
  commentNum: number
  likedNum: number
}
