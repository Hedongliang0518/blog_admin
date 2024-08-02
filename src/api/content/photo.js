import request from '@/utils/request';
// 查询用户列表
export function listPhoto(query) {
  return request({
    url: '/content/photo/list',
    method: 'get',
    params: query,
  });
}

// 新增照片
export function addPhoto(data) {
  return request({
    url: '/content/photo',
    method: 'post',
    data: data,
  });
}
