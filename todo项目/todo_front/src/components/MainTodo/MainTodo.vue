<template>
  <div class="main-todo">
    <input
      class="add-todo"
      type="text"
      placeholder="what to do?"
      autofocus
      v-model="content"
      @keyup.enter="handleAdd"
    />
    <todo-item
      v-for="todoItem in todoData"
      :key="todoItem.id"
      :todo="todoItem"
      @del="handleDel"
      @toggle="handleChange"
    ></todo-item>
    <todo-info :total="total" @toggle="handleToggle"></todo-info>
  </div>
</template>

<script>
import TodoItem from "./coms/TodoItem.vue";
import TodoInfo from "./coms/TodoInfo.vue";
export default {
  name: "MainTodo",
  data() {
    return {
      todoData: [],
      content: "",
    };
  },
  components: {
    TodoItem,
    TodoInfo,
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http.get("http://localhost:3000/todos").then((res) => {
        this.todoData = res.data.result;
      });
    },
    handleAdd() {
      if (this.content.trim() === "") {
        alert("请输入内容");
        return;
      }
      // 收集输入框的数据，调用接口
      this.$http
        .post("http://localhost:3000/todos", { content: this.content })
        .then((res) => {
          const { code, message, result } = res.data;
          alert(message);
          if (code == 0) {
            // 修改点：将新数据插入数组开头
            this.todoData.unshift(result);
            this.content = "";
          }
        });
    },
    handleChange(todo) {
      this.$http
        .put("http://localhost:3000/todos/" + todo.id, todo)
        .then((res) => {
          const { code } = res.data;
          if (code == 0) this.getData();
        });
    },
    handleDel(id) {
      this.$http.delete("http://localhost:3000/todos/" + id).then((res) => {
        const { code } = res.data;
        if (code == 0) {
          this.getData();
        }
      });
    },
    handleToggle(s) {
      this.state = s;
    },
  },
  computed: {
    total() {
      return this.todoData.filter((item) => item.completed == 0).length;
    },
    filterData() {
      switch (this.state) {
        case "all":
          return this.todoData;
        case "activate":
          return this.todoData.filter((item) => item.completed == 0);
        case "completed":
          return this.todoData.filter((item) => item.completed == 1);
      }
    },
  },
};
</script>

<style lang="stylus">
.main-todo {
  width: 600px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 5px #666;

  .add-todo {
    padding: 16px 16px 16px 36px;
    font-style: 24px;
    font-family: inherit;
    font-weight: 200;
    border: none;
    outline: none;
  }
}
</style>