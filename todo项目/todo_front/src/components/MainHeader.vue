<template>
  <header class="main-header">
    <h1>TodoList</h1>
  </header>
</template>

<script>
export default {
  name: "MainHeader",
};
</script>

<style lang="stylus">
@import '~styles/theme.styl';

.main-header {
  text-align: center;

  h1 {
    margin: 2px;
    font-size: 100px;
    font-weight: 200;
    color: $lightred;
    // 给文字阴影
    text-shadow: 5px 5px 5px rgb(0, 0, 0, 0.1);
  }
}
</style>