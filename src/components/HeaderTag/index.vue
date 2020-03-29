<template>
  <div class="header-tag" :style="{backgroundColor: bgc}">
    <span>{{ text }}</span>
    <div class="header-tag__right fr">
      <slot name="right" />
    </div>

  </div>
</template>

<script>

export default {
  name: '',

  components: {},
  props: {
    text: {
      type: String,
      default: '标题'
    },
    bgc: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {

    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='scss' scoped>
.header-tag {
  height: 30px;
  text-align: left;
  line-height: 30px;
  background-color: #fff;
  &::before {
    content: '';
    display: inline-block;
    overflow: hidden;
    width: 6px;
    height: 30px;
    background-color: #409EFF;
    color: #409EFF;
    margin-right: 10px;
  }
  span {
    display: inline-block;
    font-size: 16px;
    color: #666;
    font-weight: normal;
    vertical-align: 9px;
  }
}
</style>
