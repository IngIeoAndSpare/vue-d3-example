<template>
<div id="app">
<button v-on:click="addButton">addNode</button>
inputNodeName : <input type="text" v-model="inputData.nodeName">
targetNode : <select v-model="inputData.targetNode">
  <option v-for="(node, index) in nodeData" :key ="index">{{node.id}}</option>
</select>
lineColor : <select v-model="inputData.lineColor">
  <option v-for="(color, index) in colorArray" :key="index">{{color}}</option>
</select>
</div>
</template>

<script>
import * as d3 from 'd3';
import iconImage from '../assets/icon_set_s.png';
import { link } from 'fs';
import { line } from 'd3';

export default {
  name: 'line-drag-example',
  created() {
  },
  mounted() {
    this.setInit();
  },
  data() {
    return {
      svg: null,
      offset: 0,
      nodeData: [
        {width: 84, height: 80, x: 100, y: 100, id: 'Node1', name: 'Node1'},
        {width: 84, height: 80, x: 300, y: 300, id: 'Node2', name: 'Node2'},
        {width: 84, height: 80, x: 100, y: 300, id: 'Node3', name: 'Node3'},
        {width: 84, height: 80, x: 100, y: 500, id: 'Node4', name: 'Node4'},
        {width: 84, height: 80, x: 300, y: 500, id: 'Node5', name: 'Node5'},
        {width: 84, height: 80, x: 500, y: 200, id: 'Node6', name: 'Node6'}
      ],
      nodeLink: [
        {sourceNode: 'Node1', targetNode: 'Node2', style: 'purple'},
        {sourceNode: 'Node1', targetNode: 'Node3', style: 'green'},
        {sourceNode: 'Node2', targetNode: 'Node5', style: 'black'},
        {sourceNode: 'Node3', targetNode: 'Node4', style: 'purple'},
        {sourceNode: 'Node2', targetNode: 'Node6', style: 'purple'}
      ],
      nodes: null,
      inputData: {
        nodeName: null,
        targetNode: null,
        lineColor: null
      },
      idValue : 7,
      colorArray : ['red', 'purple', 'green', 'black', 'blue']
      // targetLink: []
    };
  },
  methods: {
    addButton: function (evt) {
      evt.preventDefault();
      let nodeItem = {width: 84, height: 80, x: 500, y: 400, id:'Node'+this.idValue , name: this.inputData.nodeName};
      let lineItem = {sourceNode: 'Node'+this.idValue, targetNode: this.inputData.targetNode, style: this.inputData.lineColor};
      this.nodeData.push(nodeItem);
      this.nodeLink.push(lineItem);
      this.nodes [nodeItem.id] = nodeItem;
      this.addLine(lineItem);
      this.addNode(nodeItem);
      this.idValue ++;
    },
    setInit: function () {
      const thisVue = this;
      d3.select('body').append('svg:svg')
      .attr('width', 1200)
      .attr('height', 700)
      .append("g").attr("id", "nodeLayer")
      .append('g').attr('id', 'linkLayer')
      
      this.nodes = {};
      for(let nodeItem of this.nodeData) {
        this.nodes [nodeItem.id] = nodeItem;
      }
      
      for(let linkItem of this.nodeLink) {
        this.addLine(linkItem);
      }
      for(let nodeItem of this.nodeData) {
        this.addNode(nodeItem);
      }
    },
    addNode: function (itemSetting) {
      const thisVue = this;
      d3.select('svg').select('#nodeLayer').append('foreignObject').attr("width", itemSetting.width).attr("height", itemSetting.height).attr('id', itemSetting.id)
        .attr("transform", "translate(" + itemSetting.x + "," + itemSetting.y + ")").call(
        d3.drag()
        .subject(function (d, i, el) {
          let pattern = /[A-z|(|)]/gi;
          let coordinate = this.getAttribute('transform').replace(pattern, '').split(',');
          return {x: coordinate[0], y:coordinate[1]}})
        .on('start', thisVue.dragStart).on('drag', thisVue.dragEvent))
        .html(thisVue.setInnerHtml(itemSetting.name));
    },
    addLine: function (lineSetting) {
      let source = this.nodes[lineSetting.sourceNode];
      let target = this.nodes[lineSetting.targetNode];
      d3.select('svg').select('#linkLayer').append('line').style('stroke', lineSetting.style).attr('id', lineSetting.id)
        .attr('x1', source.x + (source.width / 2)).attr('y1', source.y + (source.height / 2))
        .attr('x2', target.x + (target.width / 2)).attr('y2', target.y + (target.height / 2))
        .attr('sourceNode', lineSetting.sourceNode).attr('targetNode', lineSetting.targetNode);
    },
    setInnerHtml: function (nodeName) {
        return '<div class="div_block d_green" style="float: inherit;">'
              + '<div class="div_b_title "><a>'+ nodeName +'</a></div>'
              +  '<div class="div_b_btn">'
              + '<a><img src=' + iconImage + ' border="0"></a>'
              +  '</div>';
           + '</div> ';
    },
    dragStart: function(d, i, el) {
      // you can do!
    },
    dragEvent: function(d, i, el) {
      let source = this.nodes[el[0].getAttribute('id')];
        d3.selectAll(this.format("line[sourceNode={0}]", source.id)).each(function () {
          this.setAttribute('x1', d3.event.x + (source.width / 2));
          this.setAttribute('y1', d3.event.y + (source.height / 2));
        });
        d3.selectAll(this.format("line[targetNode={0}]", source.id)).each(function () {
          this.setAttribute('x2', d3.event.x + (source.width / 2));
          this.setAttribute('y2', d3.event.y + (source.height / 2));
        });
        el[0].setAttribute("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");


        this.nodes[el[0].getAttribute('id')].x = d3.event.x;
        this.nodes[el[0].getAttribute('id')].y = d3.event.y;
    },
    /**
	 * ex) format("'{0}: \"{1}\"'", "name", "value"); ==> 'name: "value"'
	 */
    format: function(value) {
      var args = Array.from(arguments).slice(1);
      return value.replace(/{(\d+)}/g, function(match, number) {
        let index = parseInt(number);
        return typeof args[index] != 'undefined' ? args[index] : match;
      });
    }
  }
}
</script>

<style scoped>

.size {
  width: 100%;
  height: 500px !important;
}
.dot{
    fill:lightblue;
    stroke:#999999;
}
.areaLimited {
  fill:green;
  fill-opacity: .4;
}

</style>
