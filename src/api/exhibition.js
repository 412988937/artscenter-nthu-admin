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

export function createExhibition(data, token) {
  return request({
    url: '/exhibitions',
    method: 'post',
    data,
    headers:{
      token: token
    }
  })
}

export function updateExhibition(id, data, token) {
  return request({
    url: '/exhibitions/'+id,
    method: 'put',
    data,
    headers:{
      token: token
    }
  })
}

export function deleteExhibition(id,token) {
  return request({
    url: '/exhibitions/' + id,
    method: 'delete',
    headers:{
      token: token
    }
  })
}
