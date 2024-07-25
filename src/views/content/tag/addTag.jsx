import { addTag, getTag, updateTag } from '@/api/content/tag';
import { Button, Col, Form, Input, message, Modal, Row, Space } from 'antd';
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
    const res = await getTag(activeData.id);
    if (res.code === 200) {
      form.setFieldsValue({ ...res.data });
    }
  };

  // 提交数据
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      if (activeData?.id) {
        const res = await updateTag({ ...values, id: activeData?.id });
        if (res.code === 200) {
          message.success('更新成功');
          changeOpen(false);
        }
      } else {
        const res = await addTag({ ...values });
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
        title='添加标签'
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
                  label='标签名'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写标签名' }]}
                >
                  <Input placeholder='请输入' maxLength={30} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='remark'
                  label='备注'
                  className='searchItem'
                  rules={[{ required: true, message: '请填写备注' }]}
                >
                  <TextArea placeholder='请输入' rows={4} allowClear />
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
