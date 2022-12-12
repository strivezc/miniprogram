

// 主包
const mainPackage = {
  index: '/pages/index/index',
  myIndex: '/pages/my/index',
}

// // 分包
const prefix = '/package-sub'

const subPackage = {
  subIndex: `${prefix}/pages/my-reward/index`,
}

const pages = {
  ...mainPackage,
  ...subPackage,
}

export default pages
