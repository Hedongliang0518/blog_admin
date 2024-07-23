import { addArticle, getArticle, updateArticle } from '@/api/content/article';
import { listAllCategory } from '@/api/content/category';
import { listAllTag } from '@/api/content/tag';
import { uploadImg } from '@/api/content/upload';
import { getUUID } from '@/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Radio, Row, Select, Space, Upload } from 'antd';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from './index.module.less';

const { TextArea } = Input;

const Write = () => {
  const [categoryList, setCategoryList] = useState([]); // 分类列表
  const [tagList, setTagList] = useState([]); // 标签列表
  const [imageUrlList, setimageUrlList] = useState([]) // 图片列表
  const [md, setMd] = useState(''); // md数据
  const [arcId, setArcId] = useState(''); // 文章id
  const [form] = Form.useForm() // 定义表单数据

  const navGateTo = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getQueryParam = (paramName) => {
    return searchParams.get(paramName);
  }

  // 获取分类列表
  const getCategoryList = async () => {
    const res = await listAllCategory()
    const list = res.data.map(item => ({ label: item.name, value: item.id }))
    setCategoryList(list)
  }

  // 获取标签列表
  const getTagList = async () => {
    const res = await listAllTag()
    const list = res.data.map(item => ({ label: item.name, value: item.id }))
    setTagList(list)
  }

  // 图片变更
  const handleChange = async (file) => {
    const res = await uploadImg(file.file)
    if (res.code === 200) {
      let obj = {
        uid: getUUID(),
        url: res.data
      }
      setimageUrlList([...imageUrlList, obj])
    }
  }

  // 移除图片
  const onRemove = (file) => {
    const newList = imageUrlList.filter((item) => item.uid !== file.uid)
    setimageUrlList(newList)
  }

  // 保存草稿
  const handleSave = (type) => {
    form.validateFields().then(async (values) => {
      const data = { ...values, tags: [values.tags], content: md, thumbnail: imageUrlList[0]?.url, status: type }
      if(!arcId) {
        const res = await addArticle(data)
        if (res.code === 200) {
          message.success(type === "0" ? '发布成功' : '保存成功')
          if(type === "0") {
            navGateTo("/article");
          }
        }
      } else {
        const res = await updateArticle({...data, id: arcId})
        if (res.code === 200) {
          message.success('更新成功')
          navGateTo("/article");
        }
      }
    })
  }

  // 获取文章详情
  const queryArticle = async (id) => {
    const res = await getArticle(id)
    if(res.code === 200) {
      form.setFieldsValue({
        title: res.data.title,
        categoryId: res.data.categoryId,
        tags: res.data.tags[0],
        summary: res.data.summary,
        isComment: res.data.isComment,
        isTop: res.data.isTop,
      })
      setMd(res.data.content)
      setimageUrlList([{ uid: getUUID(), url: res.data.thumbnail }])
    }
  }

  useEffect(() => {
    const id = getQueryParam('id')
    if(id) {
      setArcId(id)
      queryArticle(id)
    }
    getCategoryList()
    getTagList()
  }, [])

  return (
    <div className="viewBox">
      <Form form={form}>
        <Row className={styles.btnBox}>
          <Col className={styles.btnContent}>
            <Space wrap>
              {!arcId ? <Button onClick={() => handleSave("1")}>保存草稿</Button> : null}
              <Button type="primary" onClick={() => handleSave("0")}>{arcId ? '更新' : '提交'}</Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              name="title"
              label="文章标题"
              className="searchItem"
              required
              rules={[{ required: true, message: '请填写文章标题!' }]}>
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="categoryId"
              label="分类"
              className="searchItem"
              required
              rules={[{ required: true, message: '请选择分类!' }]}>
              <Select placeholder="请选择" options={categoryList} allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="tags"
              label="标签"
              className="searchItem"
              required
              rules={[{ required: true, message: '请选择标签!' }]}>
              <Select placeholder="请选择" options={tagList} allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="summary" label="文章摘要" className="searchItem">
              <TextArea placeholder="请输入" rows={4} allowClear/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isComment" label="允许评论" className="searchItem">
              <Radio.Group >
                <Radio value={'0'}>正常</Radio>
                <Radio value={'1'}>停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="isTop" label="是否置顶" className="searchItem">
              <Radio.Group >
                <Radio value={'0'}>是</Radio>
                <Radio value={'1'}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item name="thumbnail" label="缩略图" className="searchItem">
              <Upload
                listType="picture-card"
                fileList={imageUrlList}
                onRemove={onRemove}
                customRequest={handleChange}
              >
                {imageUrlList.length >= 1 ? null : (
                  <div>
                    <PlusCircleOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="thumbnail" label="" className="searchItem">
              <MdEditor modelValue={md} onChange={(v) =>  setMd(v)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
export default Write