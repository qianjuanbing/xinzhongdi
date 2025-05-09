<template>
  <div id="app">
    <el-container class="container">
      <el-aside width="200px">
        <el-menu router default-active="/">
          <div class="logo">
            <h1>
              <el-icon><Eleme /></el-icon>
              Server Manger
            </h1>
          </div>

          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <template #title><span>首页</span></template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><UserFilled /></el-icon>
            <template #title><span>用户管理</span></template>
          </el-menu-item>
          <el-menu-item index="/category">
            <el-icon><Menu /></el-icon>
            <template #title><span>分类管理</span></template>
          </el-menu-item>
          <el-menu-item index="/article">
            <el-icon><Document /></el-icon>
            <template #title><span>文章管理</span></template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <!-- 定义路由的出口，切换路由时，只改变化这部分的页面 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.container {
  /* vh: viewport height(相对单位) 跟视口一样高*/
  height: 100vh;
}
.el-menu {
  height: 100%;
}
.el-aside {
  width: 100px;
  background-color: #666;
  line-height: 200px;
}
.el-header {
  background-color: #999;
}
.el-main {
  background-color: #eee;
}
.logo {
  height: 60px;
}
.logo h1 {
  background-color: #409eff;
  color: #fff;
  font-weight: 400;
  line-height: 60px;
  text-align: center;
}
</style>
