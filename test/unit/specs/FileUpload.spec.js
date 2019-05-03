import Vue from 'vue'
import FileUpload from '@/components/FileUpload'

describe('FileUpload.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    console.log(vm.$el.querySelector('#FileUpload'))
  })
})
