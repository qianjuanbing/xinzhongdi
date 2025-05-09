<template>
  <div class="todo-info">
    <span class="total">{{ total }} item left</span>
    <div class="tab">
      <a
        class="btn primary border"
        :class="[item == state ? 'activated' : '']"
        v-for="(state, index) in states"
        :key="index"
        @click="toggle(item)"
        >{{ state }}</a
      >
    </div>
    <button class="btn info" @click="$emit('del')">Clear Completed</button>
  </div>
</template>
<script>
export default {
  name: "TodoInfo",
  // emits: ["toggle"],
  props: {
    total: {
      type: Number,
    },
  },
  data() {
    return {
      states: ["all", "active", "completed"],
      state: "all",
    };
  },
  methods: {
    toggle(s) {
      this.state = s;
      this.$emit("toggle", this.state);
    },
  },
};
</script>

<style lang="stylus">
@import '~styles/theme.styl';
@import '~styles/mixins.styl';

.todo-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  height: 30px;
  border-top: 1px solid rgbs(0, 0, 0, 0.1);

  .total {
    color: $red;
  }

  .tab {
    display: flex;
    justify-content: space-between;
    width: 220px;

    .btn.primary.borser {
      primaryBorderBtn();

      &.actived {
        primaryBtn();
      }
    }

    a {
      padding: 0 10px;
      border: 1px solid $lightred;
      border-radius: 5px;

      &.activate {
        border: none;
        background-color: $lightred;
        color: #fff;
      }
    }
  }

  .btn.info {
    infoBtn();
  }

  button {
    padding: 0 10px;
    height: 30px;
    background-color: $green;
    color: #fff;
    border-radius: 5px;
    outline: none;
    border: none;
  }
}
</style>