// 封装获取频道列表的 api

import request from '@/utils/request'

export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
