import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import DragDropExample from '@/components/DragDropExample';
import LineExample from '@/components/LineExample';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/dragDrop',
      name: 'drag-drop-example',
      component: DragDropExample
    },
    {
      path: '/line',
      name: 'line-example',
      component: LineExample
    }
  ]
})
