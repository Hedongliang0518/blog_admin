import { listAllRole } from '@/api/system/role';
import { addUser, getUser, updateUser } from '@/api/system/user';
import { passwordValidateRule, phoneValidateRule, requiredValidateRule } from '@/utils/validateRules';
import { Button, Col, Form, Input, message, Modal, Radio, Row, Select, Space } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
const AddUser = (props) => {
  const { isOpen, setIsOpen, activeData, changeOpen } = props;
  const [form] = Form.useForm(); // 定义表单数据
  const [roleList, setRoleList] = useState([]); // 角色列表

  useEffect(() => {
    getRoleList();
    if (activeData?.id) {
      queryUserInfo();
    }
  }, []);

  // 获取角色数据
  const getRoleList = async () => {
    const res = await listAllRole();
    if (res.code === 200) {
      const list = res.data.map((item) => ({ label: item.roleName, value: item.id, disabled: item.status === 1 }));
      setRoleList(list);
    }
  };

  // 获取用户信息
  const queryUserInfo = async () => {
    const res = await getUser(activeData.id);
    if (res.code === 200) {
      form.setFieldsValue({ ...res.data.user, roleIds: res.data?.roleIds[0] });
    }
  };

  // 提交数据
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      if (activeData?.id) {
        const res = await updateUser({ ...values, roleIds: [values.roleIds], id: activeData?.id });
        if (res.code === 200) {
          message.success('更新成功');
          changeOpen(false);
        }
      } else {
        const res = await addUser({ ...values, roleIds: [values.roleIds] });
        if (res.code === 200) {
          message.success('新增成功');
          changeOpen(false);
        }
      }
    });
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
        title='新增用户'
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
                  name='nickName'
                  label='用户昵称'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写用户昵称' }]}
                >
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='phonenumber' label='手机号码' className='searchItem' rules={[phoneValidateRule()]}>
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='email'
                  label='邮箱'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写邮箱' }]}
                >
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='userName'
                  label='用户名称'
                  rules={[{ required: true, message: '请填写用户名称' }]}
                  className='searchItem'
                >
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='roleIds'
                  label='角色'
                  className='searchItem'
                  rules={[{ required: true, message: '请选择角色' }]}
                >
                  <Select placeholder='请选择' options={roleList} allowClear />
                </Form.Item>
              </Col>
              {activeData?.id ? null : (
                <Col span={12}>
                  <Form.Item
                    name='password'
                    label='用户密码'
                    rules={[requiredValidateRule('请输入密码'), passwordValidateRule()]}
                    className='searchItem'
                  >
                    <Input.Password placeholder='请输入' maxLength={30} allowClear />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name='sex'
                  label='用户性别'
                  className='searchItem'
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Radio.Group>
                    <Radio value={'0'}>男</Radio>
                    <Radio value={'1'}>女</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
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
