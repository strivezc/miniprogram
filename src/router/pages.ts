

// δΈ»ε
const mainPackage = {
  index: '/pages/index/index',
  myIndex: '/pages/my/index',
}

// // εε
const prefix = '/package-sub'

const subPackage = {
  subIndex: `${prefix}/pages/my-reward/index`,
}

const pages = {
  ...mainPackage,
  ...subPackage,
}

export default pages
