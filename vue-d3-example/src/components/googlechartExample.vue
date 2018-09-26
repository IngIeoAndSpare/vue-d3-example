<template>
<!--
    this example use vue-google-charts component
    see: https://www.npmjs.com/package/vue-google-charts
    see2: https://developers.google.com/chart/
    
    if you use this components, please install vue-google-charts
    and import in main.js -> import VueGoogleCharts from 'vue-google-charts'  and  Vue.use(VueGoogleCharts)  
-->
<div>
  <GChart
    type="ColumnChart"
    :data="chartData"
    :options="chartOptions"
  />
    <GChart
    type="LineChart"
    :data="chartData"
    :options="chartOptions"
  />
  <div>
    <!-- this button is data append. Try this! and see addData method-->
    <button v-on:click="addData">addData</button>
  </div>
</div>
</template>

<script>
import { setInterval } from 'timers';
import axios from 'axios';
import { GChart } from 'vue-google-charts'
export default {
  name: 'test7',
  components: {
    GChart
  },
  created() {
    this.setInit();
  },
  mounted() {
  },
  data() {
    return {
      chartData: null,
      dateTime: 0,
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        },
        series: {
          //setting color
          0 : {color: '#e2431e'}
        },
        colors: ['#e2431e'],
        tooltip : { // 컬러 설정
          trigger: 'none'
        },
        // vAxis: { // y축 값 고정
        //   viewWindowMode:'explicit',
        //   viewWindow: {
        //     min: -100,
        //     max: 500
        //   }
        // }
      },
    //   updateFlag: true,
    };
  },
  methods: {
    setInit: function () {
      const thisVue = this;
      this.dateTime = new Date().getTime();

      let chart = [
        ['date', 'value']
      ];

      //Do you want set tooltip message? try this
      //   let chart = [
      //     ['date', 'value', {type: 'string', role: 'tooltip'}]
      //   ];
      for(let i = 1; i < 100; i++) {
        this.dateTime += 10000;
        chart.push([new Date(this.dateTime), thisVue.rand(100, -100)]);
        //if you want custom tooltip message... try this
        // chart.push([
        //  new Date(this.dateTime),
        //  thisVue.rand(100, -100),
        // 'ohhhhhh yess \n value : '+ result.value
        //  ])
      }
      this.chartData = chart;
    },
    rand: function (maxNum, min) {
      return Math.round(Math.random() * (maxNum - min) + min) + Math.random();
    },
    addData: function (evt) {
      evt.preventDefault();
      this.chartData.push([new Date(this.dateTime + 100000), null]);

      const thisVue = this;
      let dateTime = new Date().getTime();
      this.dateTime += 2000000;
      let chart = [];
      for(let i = 0; i < 100; i++) {
        this.dateTime += 10000;
        chart.push([new Date(this.dateTime), thisVue.rand(100, -100)]);
      }
      this.chartData = this.chartData.concat(chart);
    }
  }
}
</script>

<style scoped>
</style>
