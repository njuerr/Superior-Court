<template>
  <q-page>
    <div class="flex flex-center" style="margin-top: 150px">
      <q-card>
        <q-card-section class="text-h6">
          故障情况分析
        </q-card-section>
        <q-card-section>
          <div ref="linechart" id="lineChart" style="height: 350px;width: 1400px"></div>
        </q-card-section>
        <q-resize-observer @resize="onResize"/>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'IndexPage',
  data () {
    return {
      model: false,
      options: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['故障上报', '故障处理']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '故障上报',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 100, 0, 0, 0, 0, 0, 0, 0]
          },
          {
            name: '故障处理',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.$socket.emit('getIndexCourt')
    setTimeout(() => {
      this.init()
    }, 200)
  },
  watch: {
    '$q.dark.isActive': function () {
      this.init()
    }
  },
  methods: {
    init () {
      const lineChart = document.getElementById('lineChart')
      this.line_chart = echarts.init(lineChart)
      this.line_chart.setOption(this.options)
    },
    onResize () {
      if (this.line_chart) {
        this.line_chart.resize()
      }
    }
  },
  sockets: {
    recvcourt (data) {
      this.options.series[0].data = data[0]
      this.options.series[1].data = data[1]
    }
  }
}
</script>

<style scoped>
</style>
