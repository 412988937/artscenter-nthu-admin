import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/medias',
    method: 'get',
    params
  })
}

export function fetchMedia(id) {
  return request({
    url: '/medias/'+id,
    method: 'get',
  })
}

export function createMedia(data, token) {
  return request({
    url: '/medias',
    method: 'post',
    data,
    headers:{
      token: token
    }
  })
}

export function updateMedia(id, data, token) {
  return request({
    url: '/medias/'+id,
    method: 'put',
    data,
    headers:{
      token: token
    }
  })
}

export function deleteMedia(id,token) {
  return request({
    url: '/medias/' + id,
    method: 'delete',
    headers:{
      token: token
    }
  })
}
