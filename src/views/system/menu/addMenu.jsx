import { addMenu, getMenu, listMenu, roleMenuTreeselect, updateMenu } from '@/api/menu';
import { handleTree } from '@/utils';
import { Button, Col, Form, Input, InputNumber, message, Modal, Radio, Row, Space, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
const AddUser = (props) => {
  const { isOpen, setIsOpen, activeData, changeOpen } = props;
  const [form] = Form.useForm(); // 定义表单数据
  const [menuOptions, setMenuOptions] = useState([]); // 菜单权限
  const [checkedIds, setCheckedIds] = useState([]); // 选中的菜单权限
  const [value, setValue] = useState(''); // 父级菜单id
  const [type, setType] = useState('M'); // 菜单类型

  useEffect(() => {
    getTreeselect();
    if (activeData?.id) {
      queryRoleInfo();
      getRoleMenuTreeselect();
    }
  }, []);

  const onChange = (newValue) => {
    setValue(newValue);
  };

  // 递归构造菜单数据
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children?.length) {
        item.title = item.menuName;
        item.value = item.id;
        renderTreeNodes(item.children);
      } else {
        item.title = item.menuName;
        item.value = item.id;
      }
      return item;
    });
  };

  // 获取菜单数据
  const getTreeselect = async () => {
    const res = await listMenu();
    setMenuOptions([]);
    const menu = { id: 0, menuName: '主类目', children: [] };
    menu.children = handleTree(res.data, 'id');
    const list = renderTreeNodes([...menuOptions, menu]);
    setMenuOptions(list);
  };

  // 获取角色信息
  const queryRoleInfo = async () => {
    const res = await getMenu(activeData.id);
    if (res.code === 200) {
      form.setFieldsValue({ ...res.data });
      setType(res.data.menuType);
    }
  };

  // 获取已配置菜单数据
  const getRoleMenuTreeselect = async () => {
    const res = await roleMenuTreeselect(activeData.id);
    if (res.code === 200) {
      setCheckedIds(res.data.checkedKeys);
    }
  };

  // 提交数据
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      if (activeData?.id) {
        const res = await updateMenu({ ...values, id: activeData?.id });
        if (res.code === 200) {
          message.success('更新成功');
          changeOpen(false);
        }
      } else {
        const res = await addMenu({ ...values });
        if (res.code === 200) {
          message.success('新增成功');
          changeOpen(false);
        }
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({ menuType: 'M' });
  }, []);

  const footer = (
    <div>
      <Space wrap>
        <Button onClick={() => setIsOpen(false)}>取消</Button>
        <Button type='primary' onClick={handleOk}>
          确定
        </Button>
      </Space>
    </div>
  );

  return (
    <div>
      <Modal
        title='添加菜单'
        maskClosable={false}
        width={700}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={footer}
      >
        <div>
          <Form form={form}>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='parentId'
                  label='上级菜单'
                  className='searchItem'
                  rules={[{ required: true, message: '请选择菜单名称' }]}
                >
                  <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder='Please select'
                    allowClear
                    treeDefaultExpandAll
                    onChange={onChange}
                    treeData={menuOptions}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='menuType' label='菜单类型' className='searchItem'>
                  <Radio.Group onChange={(val) => setType(val.target.value)}>
                    <Radio value={'M'}>目录</Radio>
                    <Radio value={'C'}>菜单</Radio>
                    <Radio value={'F'}>按钮</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {type !== 'F' && (
                <Col span={12}>
                  <Form.Item
                    name='icon'
                    label='菜单图标'
                    className='searchItem'
                    rules={[{ required: true, message: '请填写排序' }]}
                  >
                    <Input placeholder='请输入' maxLength={30} allowClear />
                  </Form.Item>
                </Col>
              )}
              <Col span={12}>
                <Form.Item name='menuName' label='菜单名称' className='searchItem'>
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name='orderNum' label='显示排序' className='searchItem'>
                  <InputNumber min={1} max={100} />
                </Form.Item>
              </Col>
              {type !== 'F' && (
                <Col span={12}>
                  <Form.Item
                    name='path'
                    label='路由地址'
                    rules={[{ required: true, message: '请输入' }]}
                    className='searchItem'
                  >
                    <Input placeholder='请输入' maxLength={30} allowClear />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row>
              {type === 'C' && (
                <Col span={12}>
                  <Form.Item name='component' label='组件路径' className='searchItem'>
                    <Input placeholder='请输入' maxLength={30} allowClear />
                  </Form.Item>
                </Col>
              )}
              {type !== 'M' && (
                <Col span={12}>
                  <Form.Item
                    name='perms'
                    label='权限字符'
                    rules={[{ required: true, message: '请输入' }]}
                    className='searchItem'
                  >
                    {/* 控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`) */}
                    <Input placeholder='请输入' maxLength={30} allowClear />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row>
              {type !== 'F' && (
                <Col span={12}>
                  <Form.Item name='visible' label='显示状态' className='searchItem'>
                    <Radio.Group>
                      <Radio value={'0'}>显示</Radio>
                      <Radio value={'1'}>隐藏</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              )}
              {type !== 'F' && (
                <Col span={12}>
                  <Form.Item
                    name='status'
                    label='菜单状态'
                    rules={[{ required: true, message: '请选择状态' }]}
                    className='searchItem'
                  >
                    <Radio.Group>
                      <Radio value={'0'}>正常</Radio>
                      <Radio value={'1'}>停用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

AddUser.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  activeData: PropTypes.object,
};

export default AddUser;
