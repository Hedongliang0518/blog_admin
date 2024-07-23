import {
  delArticle,
  listArticle
} from '@/api/content/article';
import { Button, Col, Form, Input, message, Popconfirm, Row, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './index.module.less';

const Article = () => {
  const [form] = Form.useForm()
  const [page, setPage] = useState(1) // 当前页码
  const [pageSize, setPageSize] = useState(10) // 当前分页条数
  const [tableData, setTableData] = useState([]) // 表格数据
  const [total, setTotal] = useState(0) // 数据总条数
  const [loading, setLoading] = useState(false) // 加载状态

  const navGateTo = useNavigate();

  // 分页配置
  const paginationProps = {
    current: page, //当前页码
    pageSize: pageSize, // 每页数据条数
    position: ['bottomLeft'],
    size: 'small',
    pageSizeOptions: [10, 20, 50, 100],
    showTotal: (total) => `共${total}条`,
    total, // 总条数
    onChange: (page, pagesize) => doPageChange(page, pagesize), //改变页码的函数
    showQuickJumper: true,
    showSizeChanger: true
  }

  // 表头配置项
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (text, record, index) => `${index + 1 + (page - 1) * pageSize} `,
      fixed: 'left'
    },
    {
      title: '博文ID',
      dataIndex: 'id',
      width: 220,
      fixed: 'left'
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      ellipsis: true,
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '操作',
      width: 150,
      render: (record) => {
        return (
          <Space>
            <a onClick={() => handleUpdate(record)}>
              查看
            </a>
            <Popconfirm
              placement="top"
              title={<div>确定删除？</div>}
              onConfirm={() => handleDelete(record)}
              okText="确认"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  // 分页器改变事件
  const doPageChange = (current, pagesize) => {
    setPage(current)
    setPageSize(pagesize)
    getList(current, pagesize)
  }

  // 搜索
  const handleSearch = () => {
    getList(1)
  }
  // 重置
  const handleReset = () => {
    form.resetFields()
    getList(1, 10)
  }

  // 新增
  const handleAdd = () => {
    navGateTo("/write")
  }

  // 获取数据
  const getList = async (current, size) => {
    const data = {
      ...form.getFieldsValue(),
      pageNum: current || page,
      pageSize: size || pageSize
    }
    setLoading(true)
    const res = await listArticle(data)
    if (res.code === 200) {
      setTableData(res.data.rows)
      setTotal(res.data.total)
    }
    setLoading(false)
  }

  // 修改按钮操作
  const handleUpdate = (row) => {
    navGateTo("/write?id=" + row.id)
  }

  // 删除按钮操作
  const handleDelete = async (row) => {
    const ids = row.id
    const res = await delArticle(ids)
    if (res.code === 200) {
      message.success('删除成功')
      getList()
    }
  }

  useEffect(() => {
    getList()
  }, [])
  return (
    <div className="viewBox">
      <Form form={form}>
        <Row className={styles.btnBox}>
          <Col span={8}>
            <Form.Item
              name="title"
              label="文章标题"
              className="searchItem"
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="summary"
              label="文章摘要"
              className="searchItem"
            >
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Space wrap>
              <Button type="primary" onClick={handleSearch}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <div className='btnBox'>
        <Space wrap>
          <Button type="primary" onClick={handleAdd}>新增</Button>
          {/* <Button danger onClick={handleDelete}>删除</Button> */}
        </Space>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={paginationProps}
        scroll={{ x: 1109 }}
        rowKey="id"
      />
    </div>
  )
}

export default Article