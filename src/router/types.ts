export interface CourseDetails {
  courseScheduleId: number
  sellCourseScheduleId: number
}
export interface SettingsTypes {
  typ: 'disclaimer' | 'privacy' | 'userAgreement' | 'childrenPrivacy'
}

export interface Webview {
  src: string
}
