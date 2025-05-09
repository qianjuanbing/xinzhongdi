<template >
  <div :class="['todo-item', todo.completed ? 'todo-completed' : '']">
    <input type="checkbox" :checked="todo.completed" @change="change" />
    <label>{{ todo.content }}</label>
    <button @click="remove"></button>
  </div>
</template>
<script>
export default {
  name: "TodoItem",
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  methods: {
    change() {
      const todoData = Object.assign(this.todo);
      this.todo.completed ? (todoData.completed = 0) : (todoData.completed = 1);

      this.$emit("toggle", todoData);
    },
    remove() {
      this.$emit("del", this.todo.id);
    },
  },
};
</script>

<style lang="stylus">
@import '~styles/theme.styl';
@import '~styles/mixins.styl';

.todo-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 24px;

  &:hover {
    button::after {
      content: 'x';
      font-size: 24px;
      color: $lightred;
    }
  }

  &.todo-completed {
    label {
      color: #999;
      text-decoration: line-through;
    }
  }

  input {
    width: 50px;
    clearDefault();

    &::after {
      content: url('~images/unChecked.svg');
    }

    &:checked::after {
      content: url('~images/Checked.svg');
    }
  }

  label {
    flex: 1;
    transition: all 0.4s;
  }

  button {
    width: 40px;
    clearDefault();
    background-color: transparent;
    cursor: pointer;
  }
}
</style>