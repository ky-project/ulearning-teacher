<template>
  <div class="card" :style="{width: width, height: height}">
    <div class="card__header flex justify-between">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div>
        <slot name="btn" />
      </div>
    </div>
    <div class="card__body" :style="{height: minBodyHeight}">
      <slot name="body" />
    </div>
    <div class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<script>

export default {
  name: 'Card',
  props: {
    width: {
      type: String,
      default: '400px'
    },
    height: {
      type: String,
      default: 'auto'
    },
    title: {
      type: String,
      default: '标题'
    },
    minBodyHeight: {
      type: String,
      default: '0px'
    }
  }
}

</script>
<style lang='scss' scoped>
.card {
  position: relative;
  width: 400px;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 20px;
  &__header {
    line-height: 30px;
    padding: 10px 20px 10px 0;
    .title {
      font-size: 16px;
      &::before {
        content: '';
        display: inline-block;
        vertical-align: -5px;
        width: 5px;
        height: 20px;
        margin-right: 10px;
        background-color: #409EFF;
      }
    }
  }
  &__body {
    position: relative;
    padding: 20px 20px 0;
  }
  &__footer {
    padding: 20px;
  }
}
</style>
