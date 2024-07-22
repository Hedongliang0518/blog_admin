import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
const ArticlePier = () => {
  const chartRef = useRef(null);
  let scaleData = [
    {
      name: "VUE",
      value: 10,
    },
    {
      name: "REACT",
      value: 10,
    },
    {
      name: "JAVASCRIPT",
      value: 30,
    },
    {
      name: "CSS",
      value: 10,
    },
    {
      name: "问题记录",
      value: 10,
    },
    {
      name: "生活",
      value: 10,
    },
  ];
  // 随机颜色
  let rich = {
    white: {
      color: "#ddd",
      align: "center",
      padding: [3, 0],
    },
  };
  let placeHolderStyle = {
    normal: {
      label: {
        show: true,
      },
      labelLine: {
        show: true,
      },
      color: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(0, 0, 0, 0)",
      borderWidth: 0,
    },
  };
  function bg2() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  }

  function rancolors(len) {
    let color = [];
    for (let i = 0; i <= len; i++) {
      let sjys = bg2();
      color.push(sjys);
      for (let i = 0; i < color.length; i++) {
        if ((color[i] = sjys)) {
          color[i] = bg2();
        }
      }
    }
    return color;
  }
  let data = [];
  let color = rancolors(7);
  for (let i = 0; i < scaleData.length; i++) {
    data.push(
      {
        value: scaleData[i].value,
        name: scaleData[i].name,
        itemStyle: {
          normal: {
            borderWidth: 20,
            shadowBlur: 40,
            borderColor: color[i],
            shadowColor: color[i],
          },
        },
      },
      {
        value: 50,
        name: "",
        itemStyle: placeHolderStyle,
      }
    );
  }
  let seriesObj = [
    {
      name: "",
      type: "pie",
      clockWise: false,
      radius: [50, 100],
      hoverAnimation: true,
      itemStyle: {
        normal: {
          label: {
            show: false,
            rich: rich,
          },
          labelLine: {
            show: false,
          },
        },
      },
      data: data,
    },
  ];

  // 初始化图表
  const initCharts = () => {
    const myChart = echarts.init(chartRef.current);
    const option = {
      backgroundColor: "#2c343c7d",
      tooltip: {
        show: true,
      },
      legend: {
        show: false,
      },
      toolbox: {
        show: false,
      },
      series: seriesObj,
    };
    myChart.setOption(option);
  }

  useEffect(() => {
    initCharts()
  }, [])
  return <div ref={chartRef} style={{width: "100%", height:"47%"}}></div>
}
export default ArticlePier