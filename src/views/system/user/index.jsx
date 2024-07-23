import { delUser, listUser } from '@/api/system/user';
import { Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddUser from './addUser';
import styles from './index.module.less';

const Article = () => {
  const [form] = Form.useForm();
  const [page, setPage] = useState(1); // 当前页码
  const [pageSize, setPageSize] = useState(10); // 当前分页条数
  const [tableData, setTableData] = useState([]); // 表格数据
  const [total, setTotal] = useState(0); // 数据总条数
  const [loading, setLoading] = useState(false); // 加载状态
  const [isOpen, setIsOpen] = useState(false); // 是否打开弹窗
  const [activeData, setActiveData] = useState(null); // 当前操作的数据

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
    showSizeChanger: true,
  };

  // 表头配置项
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      render: (text, record, index) => `${index + 1 + (page - 1) * pageSize} `,
      fixed: 'left',
    },
    {
      title: '用户编号',
      dataIndex: 'id',
      width: 220,
      fixed: 'left',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      ellipsis: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => (text === '0' ? <Tag color='#87d068'>正常</Tag> : <Tag color='#f70808'>停用</Tag>),
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
            <a onClick={() => changeOpen(true, record)}>修改</a>
            <Popconfirm
              placement='top'
              title='确定删除？'
              onConfirm={() => handleDelete(record)}
              okText='确认'
              cancelText='取消'
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 分页器改变事件
  const doPageChange = (current, pagesize) => {
    setPage(current);
    setPageSize(pagesize);
    getList(current, pagesize);
  };

  // 搜索
  const handleSearch = () => {
    getList(1);
  };
  // 重置
  const handleReset = () => {
    form.resetFields();
    getList(1, 10);
  };

  // 新增
  const changeOpen = (val, data) => {
    setIsOpen(val);
    setActiveData(data);
    if (!val) {
      getList();
    }
  };

  // 获取数据
  const getList = async (current, size) => {
    const data = {
      ...form.getFieldsValue(),
      pageNum: current || page,
      pageSize: size || pageSize,
    };
    setLoading(true);
    const res = await listUser(data);
    if (res.code === 200) {
      setTableData(res.data.rows);
      setTotal(res.data.total);
    }
    setLoading(false);
  };

  // 删除按钮操作
  const handleDelete = async (row) => {
    const ids = row.id;
    const res = await delUser(ids);
    if (res.code === 200) {
      message.success('删除成功');
      getList();
    }
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className='viewBox'>
      <Form form={form}>
        <Row className={styles.btnBox}>
          <Col span={6}>
            <Form.Item name='userName' label='用户名称' className='searchItem'>
              <Input placeholder='请输入' allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='phonenumber' label='手机号码' className='searchItem'>
              <Input placeholder='请输入' allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name='status' label='状态' className='searchItem'>
              <Select
                placeholder='请选择'
                options={[
                  { label: '正常', value: '0' },
                  { label: '停用', value: '1' },
                ]}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Space wrap>
              <Button type='primary' onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Form>
      <div className='btnBox'>
        <Space wrap>
          <Button type='primary' onClick={() => changeOpen(true)}>
            新增
          </Button>
          {/* <Button danger onClick={handleDelete}>删除</Button> */}
        </Space>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        pagination={paginationProps}
        scroll={{ x: 1109 }}
        rowKey='id'
      />
      {isOpen && <AddUser isOpen={isOpen} changeOpen={changeOpen} setIsOpen={setIsOpen} activeData={activeData} />}
    </div>
  );
};

export default Article;
