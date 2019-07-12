// module.exports = {
//   plugins: {
//     'autoprefixer': {},
//     // 用于将单位转化为 rem
//     'postcss-pxtorem': {
//       rootValue: 37.5,
//       propList: ['*']
//     }
//   }
// }

// 利用 path 中的 path.sep 来获取当前系统的分隔符
const { sep } = require('path')

module.exports = ({ file }) => {
  // 如果是 vant 目录下的文件，调整宽高的时候可以直接按实际像素来设置
  let rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5
    : 75

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}