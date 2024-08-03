import { addPhoto } from '@/api/content/photo';
import { uploadImg } from '@/api/content/upload';
import { getUUID } from '@/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Space, Upload } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const AddUser = (props) => {
  const { isOpen, setIsOpen, changeOpen } = props;
  const [imageUrlList, setimageUrlList] = useState([]); // 图片列表
  const [form] = Form.useForm(); // 定义表单数据

  useEffect(() => {}, []);

  // 提交数据
  const handleOk = async () => {
    form.validateFields().then(async (values) => {
      const path = imageUrlList.map((item) => item.url).join(',');
      const data = {
        attributionTime: dayjs(values.attributionTime).format('YYYY-MM-DD'),
        photoPath: path,
        remark: values.remark,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      const res = await addPhoto(data);
      if (res.code === 200) {
        message.success('添加成功');
        changeOpen(false);
      }
    });
  };

  // 移除图片
  const onRemove = (file) => {
    const newList = imageUrlList.filter((item) => item.uid !== file.uid);
    setimageUrlList(newList);
  };

  // 图片变更
  const handleChange = async (file) => {
    const res = await uploadImg(file.file);
    if (res.code === 200) {
      let obj = {
        uid: getUUID(),
        url: res.data,
      };
      setimageUrlList([...imageUrlList, obj]);
    }
  };

  const onChange = (val) => {
    console.log(dayjs(val).format('YYYY-MM-DD'));
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
        title='上传照片'
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
                  name='attributionTime'
                  label='所属时间'
                  className='searchItem'
                  rules={[{ required: true, message: '请选择名称' }]}
                >
                  <DatePicker onChange={onChange} allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name='remark' label='照片描述' className='searchItem'>
                  <Input allowClear />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name='photoPath'
                  label='照片'
                  className='searchItem'
                  rules={[{ required: true, message: '请添加照片' }]}
                >
                  <Upload
                    listType='picture-card'
                    fileList={imageUrlList}
                    onRemove={onRemove}
                    customRequest={handleChange}
                  >
                    <div>
                      <PlusCircleOutlined />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  </Upload>
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
