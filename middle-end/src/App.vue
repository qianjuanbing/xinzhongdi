<template>
  <div id="app">
    <todo></todo>
    <!-- <Demo></Demo> -->
  </div>
</template>

<script>
import Todo from "./views/todo.vue";
import Demo from "./views/Demo.vue";
export default {
  name: "app",
  components: {
    Todo,
    Demo,
  },
};
</script>

<style>
</style>
