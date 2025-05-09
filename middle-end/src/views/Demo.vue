<template>
  <div>
    <!-- 有且只有一个根元素 -->
    <h1>vue组件的模版，可以编写vue的基本语法</h1>
    <h3>Mustache:{{ msg }}</h3>
    <button @click="handleClick">点击了{{ counter }}次</button>
  </div>
</template>

<script>
export default {
  // 定义一个组件对象,
  name: "Demo",
  data() {
    return {
      msg: "hello",
      counter: 0,
    };
  },
  methods: {
    handleClick() {
      this.counter++;
    },
  },
};
</script>