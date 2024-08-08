import { listPhoto } from '@/api/content/photo';
import { getUUID, isEmptyObject } from '@/utils';
import { Button, Col, DatePicker, Empty, Form, Image, message, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import AddPhoto from './addPhoto';
import styles from './index.module.less';

const Photo = () => {
  const [isOpen, setIsOpen] = useState(false); // 是否打开弹窗
  const [imgList, setImgList] = useState({}); // 图片分类列表
  const [loading, setLoading] = useState(false); // 加载状态

  const [form] = Form.useForm(); // 定义表单数据

  // 新增
  const changeOpen = (val, data) => {
    setIsOpen(val);
    if (!val) {
      getList();
    }
  };

  // 查询
  const doSearch = () => {
    getList();
  };

  // 获取数据
  const getList = async () => {
    const params = form.getFieldsValue();
    if (!params.year && !params.month) {
      message.error('请选择年份或月份');
      return;
    }
    const data = {
      attributionTime: params.year ? dayjs(params.year).format('YYYY') + '-01' : dayjs(params.month).format('YYYY-MM'),
      pageNum: 1,
      pageSize: 500,
      type: params.year ? 'year' : 'month',
    };
    setLoading(true);
    const res = await listPhoto(data);
    if (res.code === 200) {
      const classifiedItems = res.data.rows.reduce((acc, item) => {
        // 如果当前 name 不在累加器中，则初始化为一个新数组
        if (!acc[item.attributionTime]) {
          acc[item.attributionTime] = [];
        }
        // 将当前项添加到对应 name 的数组中
        item.photoList = item.photoPath?.split(',');
        acc[item.attributionTime].push(item);
        // 返回累加器以供下一次迭代
        return acc;
      }, {});
      setImgList(classifiedItems);
    }
    setLoading(false);
  };

  const onChange = (val) => {
    form.setFieldsValue({ year: null });
  };

  const onChangeYear = (val) => {
    form.setFieldsValue({ month: null });
  };

  useEffect(() => {
    form.setFieldsValue({ year: dayjs().startOf('year') });
    getList();
  }, []);
  return (
    <div className={styles.photoBox}>
      <div className={styles.btnBox}>
        <Form form={form}>
          <Row>
            <Col span={5}>
              <Form.Item name='month' label='月份' className='searchItem'>
                <DatePicker
                  onChange={onChange}
                  allowClear
                  picker='month'
                  style={{ width: '90%' }}
                  className={styles.picker}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name='year' label='年份' className='searchItem'>
                <DatePicker
                  onChange={onChangeYear}
                  allowClear
                  style={{ width: '90%' }}
                  picker='year'
                  className={styles.picker}
                />
              </Form.Item>
            </Col>
            <Button type='primary' onClick={doSearch}>
              查询
            </Button>
          </Row>
        </Form>
      </div>
      <div className={styles.addBtnBox}>
        <Button type='primary' onClick={() => changeOpen(true)}>
          新增
        </Button>
      </div>
      {isEmptyObject(imgList) ? (
        <div className={styles.emptyBox}>
          <Empty />
        </div>
      ) : loading ? (
        <div className={styles.spinBox}>
          <Spin />
        </div>
      ) : (
        <div className={styles.content}>
          {Object.keys(imgList).map((key, i) => (
            <>
              <div key={getUUID()} className={styles.date}>
                {key?.split(' ')[0]}
              </div>
              {imgList[key].map((item) => (
                <div key={getUUID()} className={styles.imgBox}>
                  {item.photoList.map((img, index) => (
                    <Image className={styles.img} key={getUUID()} width={100} src={img} />
                  ))}
                </div>
              ))}
            </>
          ))}
        </div>
      )}

      {isOpen && <AddPhoto isOpen={isOpen} changeOpen={changeOpen} setIsOpen={setIsOpen} />}
    </div>
  );
};

export default Photo;
