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
<br>
<button v-on:click="removeButton">removeNode</button>
targetNode : <select v-model="removeData">
  <option v-for="(node, index) in nodeData" :key ="index">{{node.id}}</option>
</select>
<br>
<button v-on:click="selectNodeForHighlight">highligteNode</button>
targetNode : <select v-model="highlightNode">
    <option v-for="(node, index) in nodeData" :key ="index">{{node.id}}</option>
</select>
_____<button v-on:click="removeHighlightButton">removeHighlight</button>
</div>
</template>

<script>
import * as d3 from 'd3';
import iconImage from '../assets/icon_set_s.png';
import { link } from 'fs';
import { line } from 'd3';
import { setTimeout } from 'timers';

export default {
  name: 'test5',
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
        {width: 84, height: 80, x: 500, y: 100, id: 'Node6', name: 'Node6'}
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
      removeData : null,
      highlightNode: null,
      idValue : 7,
      colorArray : ['red', 'purple', 'green', 'black', 'blue']
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
    removeButton: function (evt){
      evt.preventDefault();
      this.removeLine(this.removeData);
      this.removeNode(this.removeData);
    },
    removeHighlightButton: function (evt) {
      evt.preventDefault();
      this.removeHighlight();
    },
    setInit: function () {
      const thisVue = this;
      d3.select('body').append('svg:svg')
      .attr('width', 1200)
      .attr('height', 700)
      .append('g').attr('id','highligthNode')
      .append('g').attr('id', 'highlightLink')
      .append("g").attr("id", "nodeLayer")
      .append('g').attr('id', 'arrowLayer')
      .append('g').attr('id', 'linkLayer')
      
      d3.select('svg').select('#arrowLayer').append('svg:marker')
        .attr('id', 'arrowHead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 4)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#000');

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
    zoom: function () {
      d3.select('svg').select('#nodeLayer').attr('transform', d3.event.transform);
    },
    addNode: function (itemSetting) {
      const thisVue = this;
      d3.select('svg').select('#nodeLayer').append('foreignObject').attr("width", itemSetting.width).attr("height", itemSetting.height).attr('id', itemSetting.id)
        .attr("transform", "translate(" + itemSetting.x + "," + itemSetting.y + ")").attr('nodeName', itemSetting.name)
        .attr('highlight', 0).call(
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

      let sourcePoint = { x : source.x + (source.width / 2), y: source.y + (source.height / 2)};
      let targetPoint = { x : target.x + (target.width / 2), y: target.y + (target.height / 2)}
      let endPoint = this.calculation(sourcePoint, targetPoint);

      let arrow = d3.select('svg').select('#linkLayer').append('line').style('stroke', lineSetting.style).attr('id', lineSetting.id)
        .attr('x1', source.x + (source.width / 2)).attr('y1', source.y + (source.height / 2))
        .attr('x2', endPoint.x).attr('y2', endPoint.y)
        .attr('sourceNode', lineSetting.sourceNode).attr('targetNode', lineSetting.targetNode)
        .attr('highlight', 0)
        .attr('marker-end', 'url(#arrowHead)');
    },
    setInnerHtml: function (nodeName) {
        return '<div class="div_block d_green" style="float: inherit;">'
              + '<div class="div_b_title "><a>'+ nodeName +'</a></div>'
              +  '<div class="div_b_btn">'
              + '<a><img src=' + iconImage + ' border="0"></a>'
              +  '</div>';
           + '</div> ';
    },
    removeLine: function (targetNodeId) {
      const thisVue = this;
      d3.selectAll(this.format("line[sourceNode={0}", targetNodeId)).each(function () {
        thisVue.removeArray(thisVue.nodeLink, 'sourceNode', targetNodeId);
        d3.select(this).remove();
      });
      d3.selectAll(this.format("line[targetNode={0}", targetNodeId)).each(function () {
        thisVue.removeArray(thisVue.nodeLink, 'targetNode', targetNodeId);
        d3.select(this).remove();
      });
    },
    removeNode: function (targetNodeId) {
      this.removeArray(this.nodeData, 'id', targetNodeId);
      d3.select(this.format('foreignObject[id={0}]', targetNodeId)).remove();
    },
    removeArray: function (jsonArray, item, value) {
      for(let i = 0; i < jsonArray.length; i++) {
        if(jsonArray[i][item] === value) {
          jsonArray.splice(i, 1);
          break;
        }
      }
    },
    moveArrow: function (el, point) {
      el.attr('cx', point.x);
      el.attr('cy', point.y);
    },
    dragStart: function(d, i, el) {
      // you can do!
    },
    dragEvent: function(d, i, el) {
      let source = this.nodes[el[0].getAttribute('id')];
      const thisVue = this;

        d3.selectAll(this.format("line[sourceNode={0}]", source.id)).each(function () {
          let sourcePoint = {x : d3.event.x + (source.width / 2),  y : d3.event.y + (source.height / 2)};
          let targetNode = d3.select('#' + this.getAttribute('targetNode'));

          let targetPoint = thisVue.getPoint(
            targetNode.attr('transform'), Number(targetNode.attr('width')), 
            Number(targetNode.attr('height')));
          let endPoint = thisVue.calculation(sourcePoint ,targetPoint);

          this.setAttribute('x1', sourcePoint.x);
          this.setAttribute('y1', sourcePoint.y);
          this.setAttribute('x2', endPoint.x);
          this.setAttribute('y2', endPoint.y);
        });
        d3.selectAll(this.format("line[targetNode={0}]", source.id)).each(function () {
          let targetPoint = {x : d3.event.x + (source.width / 2),  y : d3.event.y + (source.height / 2)};
          let sourcePoint = {x : this.getAttribute('x1'), y : this.getAttribute('y1')};
          let endPoint = thisVue.calculation(sourcePoint ,targetPoint);
          this.setAttribute('x2', endPoint.x);
          this.setAttribute('y2', endPoint.y);
        });
        el[0].setAttribute("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");

        // x1, x2 가 같을 경우 서로 수직관계이므로 삼각형이 만들어 지지 않음.
        this.nodes[el[0].getAttribute('id')].x = d3.event.x;
        this.nodes[el[0].getAttribute('id')].y = d3.event.y;
    },
    selectNodeForHighlight: function (evt) {
      evt.preventDefault();

      this.removeHighlight();

      let nodeId = this.highlightNode;
      const thisVue = this;

      let nodeItem = d3.select(this.format('foreignObject[id={0}]', nodeId));
      this.appendHighlightLayer(nodeItem, 1);

      d3.selectAll(this.format('line[sourceNode={0}]', nodeId)).each(function () {
        let targetNode = 
          d3.select(thisVue.format('foreignObject[id={0}]', this.getAttribute('targetNode')));

          thisVue.appendHighlightLayer(targetNode, 1);
          thisVue.appendHighlightLayer(this, 0);
      });

      d3.selectAll(this.format('line[targetNode={0}]', nodeId)).each(function () {
        let sourceNode = 
          d3.select(thisVue.format('foreignObject[id={0}]', this.getAttribute('sourceNode')));
        thisVue.appendHighlightLayer(sourceNode, 1);
        thisVue.appendHighlightLayer(this, 0);
      });
    },
    appendHighlightLayer: function (element, elementType) {
      const thisVue = this;
      if(elementType == 1) {
        let point = this.getPoint(element.attr('transform'), 0, 0);
        
        // console.log('---------------------------------------------');
        // console.log('before convert => ' + element.attr('transform'));
        // console.log(element.nodeName + ' convert Point => x:' + point.x + 'y:' + point.y);
        
        d3.select('svg').select('#highligthNode').append('foreignObject')
        .attr('width', element.attr('width')).attr('height', element.attr('heigth')).attr('id', element.attr('id'))
        .attr('transform', 'translate(' + point.x + ',' + point.y + ')')
        .attr('highlight', 1).attr('nodeName', element.attr('nodeName'))
        .call(
          d3.drag().subject(function(d, i, el) {
            let pattern = /[A-z|(|)]/gi;
            let coordinate = this.getAttribute('transform').replace(pattern, '').split(',');
            return {x: coordinate[0], y:coordinate[1]}
          }).on('drag', thisVue.dragEvent)
        )
        .attr('width', 89).attr('height', 85)
        .style('background', '#23a540')
        .html(thisVue.setInnerHtml(element.attr('nodeName')));

        element.remove();
      } else {
        let item = d3.select(element);
        d3.select('svg').select('#highlightLink').append('line')
        .attr('x1', item.attr('x1')).attr('y1', item.attr('y1'))
        .attr('x2', item.attr('x2')).attr('y2', item.attr('y2'))
        .attr('sourceNode', item.attr('sourceNode')).attr('targetNode', item.attr('targetNode'))
        .attr('stroke', item.style('stroke'))
        .attr('highlight', 1)
        .attr('stroke-width', '2px')
        .attr('marker-end', 'url(#arrowHead)');

        item.remove();
      }
    },
    removeHighlight: function () {
      const thisVue = this;
      d3.selectAll('foreignObject[highlight="1"]').each(function () {
        let nodeItem = d3.select(this);
        let point = thisVue.getPoint(nodeItem.attr('transform'), 0, 0);

        // console.log('-----------------------------------------------------------------')
        // console.log('before convert => ' + nodeItem.attr('transform'));
        // console.log(nodeItem.nodeName + ' convert Point => x:' + point.x + 'y:' + point.y);

        d3.select('svg').select('#nodeLayer').append('foreignObject')
          .attr('width', 84).attr('height', 80).attr('id', nodeItem.attr('id'))
          .attr('transform', 'translate(' + point.x + ',' + point.y + ')')
          .attr('highlight', 0).attr('nodeName', nodeItem.attr('nodeName'))
          .call(
            d3.drag().subject(function(d, i, el) {
              let pattern = /[A-z|(|)]/gi;
              let coordinate = this.getAttribute('transform').replace(pattern, '').split(',');
              return {x: coordinate[0], y:coordinate[1]}
            }).on('drag', thisVue.dragEvent)
          )
          .html(thisVue.setInnerHtml(nodeItem.attr('nodeName')));
        nodeItem.remove();
      });

      d3.selectAll('line[highlight="1"]').each(function () {
        let lineItem = d3.select(this);
        d3.select('svg').select('#linkLayer').append('line')
          .attr('x1', lineItem.attr('x1')).attr('y1', lineItem.attr('y1'))
          .attr('x2', lineItem.attr('x2')).attr('y2', lineItem.attr('y2'))
          .attr('sourceNode', lineItem.attr('sourceNode')).attr('targetNode', lineItem.attr('targetNode'))
          .attr('stroke', lineItem.style('stroke'))
          .attr('stroke-width', '1px')
          .attr('highlight', 0)
          .attr('marker-end', 'url(#arrowHead)');
        lineItem.remove();
      });
    },
    onMouseOver: function (d, i, el) {
      let overItem = d3.select(el[0]);
      const thisVue = this;
      console.log('mouseover');
      d3.select(el[0]).attr('width', 89).attr('height', 85)
      .style('background', '#23a540');

      d3.selectAll(this.format('line[sourceNode={0}]', overItem.attr('id'))).each(function () {
        //targetNode 처리
        d3.select(thisVue.format('foreignObject[id={0}]', this.getAttribute('targetNode')))
        d3.select(this).attr("stroke-width", "2px");
        
      });
      d3.selectAll(this.format('line[targetNode={0}]', overItem.attr('id'))).each(function () {
        //sourceNode 처리
        d3.select(thisVue.format('foreignObject[id={0}]', this.getAttribute('sourceNode')))
        .attr('width', 89).attr('height', 85)
        .style('background', '#23a540');

        d3.select(this).attr("stroke-width", "2px");
      });
    },
    onMouseOut: function (d, i, el) {
      let overItem = d3.select(el[0]);
      const thisVue = this;

      d3.select(el[0]).attr('width', 84).attr('height', 80)
      .style('background', '');

      d3.selectAll(this.format('line[sourceNode={0}]', overItem.attr('id'))).each(function () {
        //targetNode 처리
        d3.select(thisVue.format('foreignObject[id={0}]', this.getAttribute('targetNode')))
        .attr('width', 84)
        .attr('height', 80)
        .style('background', '');
        d3.select(this).attr("stroke-width", "1px");
      });
      d3.selectAll(this.format('line[targetNode={0}]', overItem.attr('id'))).each(function () {
        //sourceNode 처리
        d3.select(thisVue.format('foreignObject[id={0}]', this.getAttribute('sourceNode')))
        .attr('width', 84)
        .attr('height', 80)
        .style('background', '');
        d3.select(this).attr("stroke-width", "1px");
      });
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
    },
    getPoint: function (translateString, width, heigth) {
      let pattern = /[^0-9|,|.]/gi;
      let convertString = translateString.replace(pattern, '').split(',');
      return { x: Number(convertString[0]) + (width / 2), y: Number(convertString[1]) + (heigth / 2) };
    },
    calculation: function (sourcePoint, targetPoint) {

      let x1 = Number(sourcePoint.x);
      let y1 = Number(sourcePoint.y);
      let x2 = Number(targetPoint.x);
      let y2 = Number(targetPoint.y);
      let centerPoint;
      let crossingPoint;
      let targetCenterPoint;
      let ratioY;
      let ratioX;
      let collectValue;
      let flag;
      if(x1 == x2) {
        if(y1 > y2) {
          //target이 직선 위에 있는 경우 
          crossingPoint = {x : x1, y : y2 + 40};
        } else {
          //target 이 직선 아래에 있는 경우
          crossingPoint = {x : x1, y : y2 - 40};
        }
      } else {
        if(y1 > y2) {
          //target 이 위에 있는 경우 
          centerPoint = {x : x2, y : y1};

          let o1 = Math.atan((y1 - y2) / (x1 - x2));
          let o2 = Math.atan((centerPoint.y - y1) / (centerPoint.x - x1));
          let angle = ((o1-o2) * 180/Math.PI);
          
          // console.log('각도 =>' + angle);
          
          if(Math.abs(angle) > 45) {
            flag = true;
            targetCenterPoint = {x : x2, y : y2 + 55};
            ratioY = {
              y1 : (centerPoint.y - y2),
              y2 : (targetCenterPoint.y - y2)
            }
            ratioX = {
              x : (centerPoint.x - x1)
            }
          } else {
            flag = false;
            let centerX = (angle > 0 ? x2 + 45 : x2 - 45);
            targetCenterPoint = {x: centerX, y : y2};
            ratioY = {y : (centerPoint.y -  y2)};
            ratioX = {
              x1 : (centerPoint.x - x1),
              x2 : (targetCenterPoint.x - x2)
            }
          }
        } else {
          //target 이 아래에 있는 경우
          centerPoint = {x : x1, y : y2};
          let o1 = Math.atan((y1 - y2) / (x1 - x2));
          let o2 = Math.atan((centerPoint.y - y2) / (centerPoint.x - x2));
          let angle = ((o1-o2) * 180/Math.PI);
          // console.log('각도 =>' + angle);

          if(Math.abs(angle) > 45){
            //사이 각도가 45도보다 커서 y값 고정
            flag = true;
            targetCenterPoint = {x : x2, y: y2 - 45};
            ratioY = {
              y1 : (centerPoint.y -  y1),
              y2 : (targetCenterPoint.y - y2)  
            };
            ratioX = {
              x : (centerPoint.x - x2)
            }
          } else {
            //사이 각도가 45도보다 작아서 x값 고정
            flag = false;
            let centerX = (angle > 0 ? (x2 - 45) : (x2 + 45));
            targetCenterPoint = {x : centerX, y : y2};
            ratioY = {y : (centerPoint.y - y1)}
            ratioX = {
              x1 : (centerPoint.x - x2),
              x2 : (targetCenterPoint.x - x2)}
          }
        }
        if(flag) {
          crossingPoint = {
              x : ( -1*((ratioX.x * ratioY.y2) / ratioY.y1) + x2).toFixed(4),
              y : targetCenterPoint.y + 5
          } 
        } else {
          crossingPoint = {
            x : targetCenterPoint.x,
            y : ( -1*(ratioX.x2 * ratioY.y) / ratioX.x1 + y2).toFixed(4)
          }
        }
      }
      return crossingPoint;
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
