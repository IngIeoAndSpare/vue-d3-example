<template>
<div id="app">
<button v-on:click="addTest(1)">addRedNode</button>
<button v-on:click="addTest(2)">addNormalNode</button>
<button v-on:click="setInit">test2</button>
<svg id="drawArea" class="size"></svg>


</div>
</template>

<script>
import * as d3 from 'd3';
import iconImage from '../assets/icon_set_s.png';

export default {
  name: 'drag-drop-example',
  created() {
  },
  mounted() {
      d3.select('svg')
      .append("g").attr('id', 'nodeLayer')   // svg layer 등록 (nodeLayer)
      .append("g").attr('id', 'dropLayer');  // svg layer 등록 (drop area layer)
  },
  data() {
    return {
      svg: null,
      jsonAreasTrabajo : [  // drop area 정보
        {"width": 150, "height": 150, "x": 10, "y": 10, "id": "service1"},
        {"width": 150, "height": 150, "x": 300, "y": 10, "id": "service2"},
        {"width": 150, "height": 150, "x": 10, "y": 300, "id": "service3"}
      ],
      offset: 0,      //node id offset
      addOffset: 100, //create coordinate offset
      originX: 0,     //drag origin x coordinate
      originY: 0,     //drag origin y coordinate
      addY: 200,      //create coordinate point x
      addX : 700,     //create coordinate point y
    };
  },
  methods: {
    setInit: function () {
    // drop area setting...
    d3.select('svg').select('#dropLayer')
      .selectAll("rect")
        .data(this.jsonAreasTrabajo)
        .enter()
        .append('rect')
        .attr('id', function (d) {
          return d.id;
        })
        .attr('x', function (d) {
          return d.x;
        })
        .attr('y', function (d) {
          return d.y;
        })
        .attr('width', function (d) {
          return d.width;
        })
        .attr('height', function (d) {
          return d.height;
        })
        .attr('class', 'areaLimited');
    },
    addTest: function(flag) {
      console.log(this.offset);
      // node append -> #nodeLayer ... html append use foreignObject
      d3.select('svg').select('#nodeLayer').append('foreignObject').attr("width", 84).attr("height", 80).attr('id','cir_'+this.offset)
      .attr("transform", "translate(" + this.addX + "," + this.addY + ")")
      .on('click', function (d, i, el) {
        //클릭 이벤트
        console.log('click element id =>' + el[0].getAttribute('id'));
        // d3.event.stopPropagation();
        // d3.event.preventDefault();
      })
      // .on('contextmenu', function(d, i, el) {
      //   d3.select(el[0]).remove();
      // })
      .call(
        d3.drag().subject(function (d, i, el) {
          let pattern = /[A-z|(|)]/gi;
          let coordinate = el[0].getAttribute('transform').replace(pattern, '').split(',');
          return {x: coordinate[0], y:coordinate[1]}
        }) 
        .on("start", this.dragStart)
        .on("drag", this.dragEvent)
        .on("end", this.dragEndEvent)
      )
      .html(this.setInnerHtml(flag));
      
      this.offset += 1;
      this.addY += this.addOffset;
      if(this.offset % 3 === 0) {
         this.addY = 200;
         this.addX += this.addOffset
      }
    },
    setInnerHtml: function (flag) {
      if(flag === 1) {
        return '<div class="div_block d_red d_green" style="float: inherit;">'
              + '<div class="div_b_title ">Node</div>'
              +  '<div class="div_b_btn">'
              + '<a><img src=' + iconImage + ' border="0"></a>'
              +  '</div>';
           + '</div> ';
      } else {
        return  '<div class="div_block d_green" style="float: inherit;">'
              + '<div class="div_b_title ">Node</div>'
              +  '<div class="div_b_btn">'
              +  '<a><img src=' + iconImage + ' border="0"></a>'
              +  '</div>';
           + '</div> ';
      }
    },
    dragEndEvent: function (d, i, el) {
      if(d3.event.defaultPrevented) return;
      let x = d3.event.x;
      let y = d3.event.y;
      let checkResult = this.checkArea(x, y);
      if(checkResult.inputCheck) {
        // append drop item (clone)
        d3.select('svg').select('#nodeLayer').append('foreignObject').attr("width", 84).attr("height", 80)
        .attr('value', el[0].getAttribute('id'))
        // setting append coordinate -> drop area center...
        .attr("transform", "translate(" + (checkResult.centerX - 45) + "," + (checkResult.centerY - 50) + ")")
        .on('contextmenu', function(d, i, target) {
          d3.select(target[0]).remove();
        })
        .on('click', function (d, i, target) {
          console.log('click element value =>' + target[0].getAttribute('value'));
        })
        .html(el[0].innerHTML);
        console.log('input item! area id:' + checkResult.boxId + '   element id: ' + el[0].getAttribute('id'));
      } 
      // origen coordinate back
      el[0].setAttribute("transform", "translate(" + (Number(this.originX)) + "," + (Number(this.originY))+ ")");
      
    },
    dragEvent: function (d, i, el) {
      if(d3.event.defaultPrevented) return;
      console.log('[ dragging ]');
      el[0].setAttribute("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
    },
    // d3ClickEvent: function (d, i, el) {
    //   //svg 클릭 시 el => svg 정보
    //   console.log('[svg] d ===>' + d + '   ' + 'i =====> ' + i);
    // },
    dragStart: function (d, i, el) {
      // origin coordinate 
      let pattern = /[A-z|(|)]/gi;
      let coordinate = el[0].getAttribute('transform').replace(pattern, '').split(',');
      this.originX = coordinate[0];
      this.originY = coordinate[1];
      console.log('[ drag start ]');
    },
    checkArea: function (dropX, dropY) {
      let boxId, centerX, centerY;
      let inputCheck = false;
      d3.selectAll('.areaLimited').each(function (d, i, el) {
        // d - datum
        // i - identifier or index
        // el - this element 
        var bbox = d3.select(this).node().getBBox();
        var bbox2 = d3.select(this).node();
        var x = bbox.x;
        var y = bbox.y;
        var width = bbox.width;
        var height = bbox.height;
        var xmax = x + width;
        var ymax = y + height;
        if(dropX > x && dropX < xmax && dropY > y && dropY < ymax) {
          boxId = bbox2.getAttribute('id');
          inputCheck = true;
          centerX = Number((x + xmax) / 2);
          centerY = Number((y + ymax) / 2);
        }
      });
      return {
        boxId,
        inputCheck,
        centerX,
        centerY
      };
    },
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
