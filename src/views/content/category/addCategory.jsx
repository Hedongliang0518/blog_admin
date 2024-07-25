import { addCategory, getCategory, updateCategory } from '@/api/content/category';
import { Button, Col, Form, Input, message, Modal, Radio, Row, Space } from 'antd';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const { TextArea } = Input;
const AddUser = (props) => {
  const { isOpen, setIsOpen, activeData, changeOpen } = props;
  const [form] = Form.useForm(); // 定义表单数据

  useEffect(() => {
    if (activeData?.id) {
      queryRoleInfo();
    }
  }, []);

  // 获取分类信息
  const queryRoleInfo = async () => {
    const res = await getCategory(activeData.id);
    if (res.code === 200) {
      form.setFieldsValue({ ...res.data });
    }
  };

  // 提交数据
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      if (activeData?.id) {
        const res = await updateCategory({ ...values, id: activeData?.id });
        if (res.code === 200) {
          message.success('更新成功');
          changeOpen(false);
        }
      } else {
        const res = await addCategory({ ...values });
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
        title='添加分类'
        maskClosable={false}
        width={600}
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={footer}
      >
        <div>
          <Form form={form}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='name'
                  label='分类名'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写分类名' }]}
                >
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='description'
                  label='描述'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写描述' }]}
                >
                  <TextArea placeholder='请输入' rows={4} allowClear />
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
