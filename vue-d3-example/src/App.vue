<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}


.div_block   {float:left;display:inline-block;min-height:80px;padding:8px 15px 0px 15px;font-size:15px;font-weight: 600;border-radius: 5px;margin:5px 8px 5px 0;}
.div_b_title {width: 100%;display: inline-block;font-weight: 600;text-align: center;padding-bottom: 10px;}
.div_b_btn   {text-align: center;}
.d_blue      {color: #2a71e7;background:#e1eefd;border:1px solid #a2bedf;}
.d_blue     a{color: #2a71e7;}
.d_blue     a:hover{text-decoration: underline;;}
.d_purple   a:hover{text-decoration: underline;}
.d_purple    {color: #6761a9;background:#e5e5f8;border:1px solid #ababd5;}
.d_purple   a{color: #6761a9;}
.d_purple   a:hover{text-decoration: underline;}
.d_green     {color: #23a540;background:#e1fade;border:1px solid #9fd798;}
.d_green    a{color: #23a540;}
.d_green    a:hover{text-decoration: underline;}
.d_red      {border: 2px solid #ed0404;}

/* text */
.text_b_c  {text-align: center;font-weight:600;font-size:16px;text-align: right;}
.text_blue {color: #2a71e7 !important;}
.text_purple {color: #6761a9 !important;}
.text_green  {color: #23a540 !important;}

.sbtn {display: inline-block;padding:5px 8px; margin-bottom: 0;font-size: 13px;font-weight: 400;line-height: 1.42857143;
       text-align: center;white-space: nowrap;vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer;
       -webkit-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none; background-image: none; border: 1px solid transparent;border-radius: 3px;}       

  
.btn-normail {color: #333 !important;background-color: #fff !important;border-color: #cccccc !important;}
.btn-normail:hover {color: #333 !important;background-color: #eaecee !important;border: 1px solid #c6d1e6 !important;}

</style>
