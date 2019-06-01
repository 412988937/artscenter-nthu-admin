import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/exhibitions',
    method: 'get',
    params
  })
}

export function fetchExhibition(id) {
  return request({
    url: '/exhibitions/'+id,
    method: 'get',
  })
}
