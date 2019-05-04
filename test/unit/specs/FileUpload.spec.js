import Vue from 'vue'
import FileUpload from '@/components/FileUpload'

const path = require('path')
const file = path.resolve(__dirname, '../files/test_001.png')
jest.mock('axios')

describe('FileUpload.vue', () => {
  it('onFileChange not called callCreateImage', () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    const mockcallCreateImage = jest.fn()
    vm.callCreateImage = mockcallCreateImage
    vm.onFileChange('aa')
    expect(mockcallCreateImage.mock.calls.length).toBe(0)
  })
  it('onFileChange called callCreateImage', () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    const mockcallCreateImage = jest.fn()
    vm.callCreateImage = mockcallCreateImage
    vm.onFileChange({'target': {'files': ['test.png', 'test2.png']}})
    expect(mockcallCreateImage.mock.calls[0][0]).toEqual(expect.arrayContaining(['test.png', 'test2.png']))
  })
  it('callCreateImage called createImage', () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    const mockCreateImage = jest.fn()
    vm.createImage = mockCreateImage
    vm.callCreateImage(['test.png', 'test2.png'])
    expect(mockCreateImage.mock.calls[0][0]).toBe('test.png')
  })
  it('removeImage', () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    vm.image = 'test'
    vm.removeImage()
    expect(vm.image).toBe('')
  })
})
