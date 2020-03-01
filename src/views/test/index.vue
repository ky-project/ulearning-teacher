<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <SelectQuestoinType :type.sync="type" :options.sync="options" :answer.sync="answer" />
    </el-form>
  </div>
</template>

<script>
import SelectQuestoinType from '@/views/questionBank/components/SelectQuestoinType'
export default {
  name: '',

  components: { SelectQuestoinType },
  props: {

  },
  data() {
    return {
      form: {},
      type: '',
      options: [],
      answer: ''
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {}

}

</script>
<style lang='' scoped>

</style>
