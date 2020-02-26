<template>
  <div
    v-show="visible"
    class="right-menu"
    :style="{left: left+'px', top: top+'px'}"
    @click.stop="()=>{}"
  >
    <ul class="right-menu__list">
      <li
        v-for="(item,index) in data"
        :key="item.content"
        class="right-menu__item"
        @click="clickHandler(index)"
      >
        <svg-icon v-if="item.icon" :icon-class="item.icon" />
        <span>{{ item.content }}</span>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'RightMenu',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    data: {
      type: Array, // [{icon: xxx, content: xxx}]
      required: true
    },
    // 绑定到的元素
    el: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      left: 0,
      top: 0
    }
  },
  mounted() {
    // 去掉默认右键菜单事件
    const el = document.querySelector(this.el)
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault()
    }, false)
    // 监听右键点击事件
    el.addEventListener('mousedown', (e) => {
      const { button, clientX, clientY } = e
      if (button === 2) {
        this.top = clientY
        this.left = clientX
        this.$emit('update:visible', true)
      }
    }, false)
    // 点击外部关闭
    // 1. 最外层div设置禁止click冒泡
    // 2. 添加body点击事件
    document.body.addEventListener('click', () => {
      this.$emit('update:visible', false)
    }, false)
  },
  methods: {
    clickHandler(index) {
      this.$emit('click', index)
      this.$emit('update:visible', false)
    }
  }
}

</script>
<style lang='scss' scoped>
.right-menu {
  width: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: fixed;
  background: #fff;
  &__item {
    line-height: 30px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
    font-size: 12px;
    color: #666;
    &:hover {
      background-color: #eee;
      cursor: pointer;
    }
  }
}
</style>
