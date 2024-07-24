import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/menu';
import { addRole, getRole, updateRole } from '@/api/system/role';
import { Button, Col, Form, Input, InputNumber, message, Modal, Radio, Row, Space, Tree } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
const AddUser = (props) => {
  const { isOpen, setIsOpen, activeData, changeOpen } = props;
  const [form] = Form.useForm(); // 定义表单数据
  const [menuOptions, setMenuOptions] = useState([]); // 菜单权限
  const [checkedIds, setCheckedIds] = useState([]); // 选中的菜单权限

  useEffect(() => {
    getMenuOptions();
    if (activeData?.id) {
      queryRoleInfo();
      getRoleMenuTreeselect();
    }
  }, []);

  // 递归构造菜单数据
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children?.length) {
        item.title = item.label;
        item.key = item.id;
        renderTreeNodes(item.children);
      } else {
        item.title = item.label;
        item.key = item.id;
      }
      return item;
    });
  };

  // 获取菜单数据
  const getMenuOptions = async () => {
    const res = await menuTreeselect();
    if (res.code === 200) {
      const list = renderTreeNodes(res.data);
      setMenuOptions(list);
    }
  };

  // 获取角色信息
  const queryRoleInfo = async () => {
    const res = await getRole(activeData.id);
    if (res.code === 200) {
      form.setFieldsValue({ ...res.data });
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
        const res = await updateRole({ ...values, menuIds: checkedIds, id: activeData?.id });
        if (res.code === 200) {
          message.success('更新成功');
          changeOpen(false);
        }
      } else {
        const res = await addRole({ ...values, menuIds: checkedIds });
        if (res.code === 200) {
          message.success('新增成功');
          changeOpen(false);
        }
      }
    });
  };

  // 菜单选中
  const onCheck = (checkedKeys, info) => {
    setCheckedIds(checkedKeys);
  };

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
        title='添加角色'
        maskClosable={false}
        width={600}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={footer}
      >
        <div>
          <Form form={form}>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='roleName'
                  label='角色名称'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写角色名称' }]}
                >
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='roleKey'
                  label='权限字符'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写权限字符' }]}
                >
                  {/* 控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`) */}
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='roleSort'
                  label='角色顺序'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写角色顺序' }]}
                >
                  <InputNumber min={1} max={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='remark' label='备注' className='searchItem'>
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='status'
                  label='状态'
                  rules={[{ required: true, message: '请选择状态' }]}
                  className='searchItem'
                >
                  <Radio.Group>
                    <Radio value={'0'}>正常</Radio>
                    <Radio value={'1'}>停用</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='menuIds' label='菜单权限' className='searchItem'>
                  <Tree checkable checkedKeys={checkedIds} onCheck={onCheck} treeData={menuOptions} />
                </Form.Item>
              </Col>
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
