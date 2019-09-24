import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/banners',
    method: 'get',
    params
  })
}

export function fetchBanner(id) {
  return request({
    url: '/banners/'+id,
    method: 'get',
  })
}

export function createBanner(data, token) {
  return request({
    url: '/banners',
    method: 'post',
    data,
    headers:{
      token: token
    }
  })
}

export function updateBanner(id, data, token) {
  return request({
    url: '/banners/'+id,
    method: 'put',
    data,
    headers:{
      token: token
    }
  })
}

export function deleteBanner(id,token) {
  return request({
    url: '/banners/' + id,
    method: 'delete',
    headers:{
      token: token
    }
  })
}
