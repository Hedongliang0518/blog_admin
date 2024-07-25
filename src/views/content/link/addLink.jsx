import { addLink, getLink, updateLink } from '@/api/content/link';
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
    const res = await getLink(activeData.id);
    if (res.code === 200) {
      form.setFieldsValue({ ...res.data });
    }
  };

  // 提交数据
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      if (activeData?.id) {
        const res = await updateLink({ ...values, id: activeData?.id });
        if (res.code === 200) {
          message.success('更新成功');
          changeOpen(false);
        }
      } else {
        const res = await addLink({ ...values });
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
        title='添加友链'
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
                  label='名称'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写名称' }]}
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
              <Col span={24}>
                <Form.Item
                  name='logo'
                  label='logo'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写logo' }]}
                >
                  <Input placeholder='请输入' maxLength={1000} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='address'
                  label='地址'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写地址' }]}
                >
                  <Input placeholder='请输入' maxLength={100} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='status'
                  label='状态'
                  rules={[{ required: true, message: '请选择状态' }]}
                  className='searchItem'
                >
                  <Radio.Group>
                    <Radio value={'0'}>审核通过</Radio>
                    <Radio value={'1'}>审核未通过</Radio>
                    <Radio value={'2'}>未审核</Radio>
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
