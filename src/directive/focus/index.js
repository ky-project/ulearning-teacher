export default {
  update: function(el, binding, vnode) {
    const { value, oldValue } = binding
    if (value !== oldValue && value) {
      console.log('聚焦')
      el.focus()
    }
  }
}
