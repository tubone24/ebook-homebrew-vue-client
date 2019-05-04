import Vue from 'vue'
import FileUpload from '@/components/FileUpload'
import axios from 'axios'

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
  it('postImage', async () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    const resp = {'data': {'upload_id': 'testId'}}
    axios.post.mockResolvedValue(resp)
    await vm.postImage('test')
    expect(vm.uploadId).toBe('testId')
  })
  it('convertImages', async () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    const resp200 = {'status': 200}
    const resp404 = {'status': 404}
    expect(vm.converted).toBe(false)
    axios.post.mockResolvedValueOnce(resp404).mockResolvedValueOnce(resp200)
    await vm.convertImages('test')
    expect(vm.converted).toBe(true)
  })
})
