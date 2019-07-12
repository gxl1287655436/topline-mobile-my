// 把操作本地存储的用户信息封装为一个模块

// 为了方便更改存储的用户信息的名称
const USER_KEY = 'user'

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const saveUser = (data) => {
   window.localStorage.setItem(USER_KEY,JSON.stringify(data))
}

export const removeUser = () => {
   window.localStorage.removeItem(USER_KEY)
}

