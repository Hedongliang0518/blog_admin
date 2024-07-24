import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
const ArticleCount = () => {
  const chartRef = useRef(null);
  let img1 = {
    a: '/src/assets/imgs/icon/Vue.png',
    b: '/src/assets/imgs/icon/Vue_no.png',
  };

  let img2 = {
    a: '/src/assets/imgs/icon/react.png',
    b: '/src/assets/imgs/icon/react_no.png',
  };

  let img3 = {
    a: '/src/assets/imgs/icon/js.png',
    b: '/src/assets/imgs/icon/js_no.png',
  };

  let img4 = {
    a: '/src/assets/imgs/icon/suffix.png',
    b: '/src/assets/imgs/icon/suffix_no.png',
  };

  let img5 = {
    a: '/src/assets/imgs/icon/wt.png',
    b: '/src/assets/imgs/icon/wt_no.png',
  };

  // 初始化图表
  const initCharts = () => {
    const myChart = echarts.init(chartRef.current);
    const option = {
      title: {
        text: '文章分类数量统计',
        subtext: '',
        textStyle: {
          color: '#fff',
          fontSize: 14,
        },
        left: '4.5%',
        top: '2%',
      },
      backgroundColor: '#2c343c7d',
      grid: {
        left: '5%',
        top: '15%',
        bottom: '2%',
        right: '20%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: [
        {
          type: 'category',
          inverse: false,
          data: ['VUE', 'REACT', 'JS', 'CSS', '问题'],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#3e86dd',
            },
          },
          axisLabel: {
            margin: 35,
            textStyle: {
              color: '#fff',
              fontSize: 12,
            },
          },
        },
      ],
      series: [
        {
          tooltip: {
            show: false,
          },
          z: 4,
          type: 'pictorialBar',
          symbolSize: ['30', '30'],
          symbolRepeat: 'fixed',
          data: [
            {
              value: 100,
              symbol: 'image://' + img1.b,
            },
            {
              value: 100,
              symbol: 'image://' + img2.b,
            },
            {
              value: 100,
              symbol: 'image://' + img3.b,
            },
            {
              value: 100,
              symbol: 'image://' + img4.b,
            },
            {
              value: 100,
              symbol: 'image://' + img5.b,
            },
          ],
        },
        {
          z: 6,
          type: 'pictorialBar',

          symbolSize: ['30', '30'],

          animation: true,
          symbolRepeat: 'fixed',
          symbolClip: true,
          symbolPosition: 'start',
          symbolOffset: [0, 0],
          data: [
            {
              value: 60,
              symbol: 'image://' + img1.a,
            },
            {
              value: 15,
              symbol: 'image://' + img2.a,
            },
            {
              value: 50,
              symbol: 'image://' + img3.a,
            },
            {
              value: 19,
              symbol: 'image://' + img4.a,
            },
            {
              value: 39,
              symbol: 'image://' + img5.a,
            },
          ],
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#18fcff',
                fontSize: 14,
              },
              position: 'right',
              offset: [35, 0],
            },
          },
        },
        {
          type: 'bar',
        },
      ],
    };
    myChart.setOption(option);
  };

  useEffect(() => {
    initCharts();
  }, []);
  return <div ref={chartRef} style={{ width: '100%', height: '47%' }}></div>;
};
export default ArticleCount;
