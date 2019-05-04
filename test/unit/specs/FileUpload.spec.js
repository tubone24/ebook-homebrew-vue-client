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
  it('createImage', () => {
    const Constructor = Vue.extend(FileUpload)
    const vm = new Constructor().$mount()
    const imageB64 = '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'
    const bstr = atob(imageB64)
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const file = new File([u8arr], 'test.png', {type: 'image/png'})
    vm.createImage(file)
    expect(vm.images.length).toBe(0)
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
