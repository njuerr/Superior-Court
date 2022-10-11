<template>
  <q-page>
    <div className="proCharts" ref='charts'>
    </div>
  </q-page>
</template>

<script>
import * as echarts from 'echarts'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'test',
  data () {
    return {
      option: {
        color: ['rgb(8,252,7)', 'rgb(255,168,0)'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'roundRect',
          data: [
            {
              name: '上报故障',
              textStyle: {
                color: 'black'
              }

            }, {
              name: '故障处理',
              textStyle: {
                color: 'black'
              }
            }
          ]
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '17%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLabel: {
            interval: 0,
            textStyle: {
              color: 'black',
              fontSize: 10
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'black'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            textStyle: {
              color: 'black'
            }
          },
          max: 100,
          axisLine: {
            show: true,
            lineStyle: {
              color: 'black'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['white']
            }
          }
        },
        series: [
          {
            name: '上报故障',
            type: 'line',
            data: [10, 20, 30, 50, 50, 10, 50, 60, 10, 50, 10, 30],
            lineStyle: {
              color: 'blue'
            }
          },
          {
            name: '故障处理',
            type: 'line',
            data: [20, 20, 30, 50, 50, 10, 50, 20, 30, 50, 50, 30],
            lineStyle: {
              color: 'red'
            }
          }
        ]
      }
    }
  },
  created () {

  },
  mounted () {
    this.mycharts()
  },
  methods: {
    mycharts () {
      const myChart = echarts.init(this.$refs.charts, 'macarons')
      myChart.setOption(this.option)
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    }
  }
}
</script>

<style scoped>
.proCharts {
  width: 100%;
  height: 400px;
}
</style>
