<template>
  <div class="home">
    <img :src="bgImg" alt="" class="bg">
    <div class="welcome">
      <p>欢迎登录</p>
      <p>基于泛在学习的教师管理系统</p>
    </div>
  </div>
</template>

<script>
import bgImg from '@/assets/images/showcase.png'
export default {
  name: 'Home',

  components: {},
  props: [''],
  data() {
    return {

    }
  },

  computed: {
    bgImg() {
      return bgImg
    }
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='scss' scoped>
.home {
  height: calc(100vh - 50px);
  .bg {
    object-fit: fill;
    height: 100%;
    filter: blur(5px)
  }
  .welcome {
    text-align: center;
    position: absolute;
    transform: translateX(-50%);
    top: 200px;
    left: 50%;
    p {
      font-size: 40px;
      color: #fff;
      margin-bottom: 20px;
    }
  }
}

</style>
