// 接口响应通过格式
export interface ApiResp<T> {
  resultCode: number
  resultMessage: string
  resultData: T
}
export interface ApiRespList<T> {
  resultCode: number
  resultMessage: string
  resultData: T
  totalCount: number
  currpageSizeentPage: number
}

export interface PageMeta {
  currentPage: number
  totalCount: number
  pageSize: number
}

export interface UploadResp {
  code: number
  msg: string
  data: {
    filename: string
    fileUrl: string
  }
}
