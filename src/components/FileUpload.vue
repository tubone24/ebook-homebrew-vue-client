<template>
  <div id="FileUpload">
    <div>
      <select v-model="selected" @change="onFileFormatChange">
        <option disabled value="">Please select one</option>
        <option>image/png</option>
        <option>image/jpeg</option>
        <option>image/gif</option>
      </select>
      <span>Image Format: {{ selected }}</span>
    </div>
    <div v-if="!image">
      <h2>Select images</h2>
      <input type="file" @change="onFileChange" multiple="multiple" accept="image/*">
    </div>
    <div v-else>
      <img :src="image"/>
      <button class="btn btn-danger" @click="removeImage">Remove images</button>
      <div v-if="selected && images">
        <button class="btn btn-primary" @click="postImage">Post images</button>
      </div>
      <div v-if="uploadId">
        <span>UploadId: {{ uploadId }}</span>
      </div>
      <div v-if="uploadId">
        <div class="row">
          <div class="col-sm-6">
            <button class="btn btn-info" @click="convertImages">Convert images</button>
          </div>
          <div v-if="converted" class="col-sm-6">
            <button class="btn btn-success" @click="downloadPDF">Download PDF</button>
          </div>
          <div v-else class="col-sm-6">
            <button class="btn btn-warning" @click="downloadPDF">Download PDF</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import mixins from '../mixins/const'

const backendURL = mixins.data().backendURL

export default {
  name: 'FileUpload',
  data () {
    return {
      image: '',
      images: [],
      selected: '',
      uploadId: '',
      converted: false
    }
  },
  methods: {
    async onFileChange (e) {
      let vm = this
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      await this.callCreateImage(files)
      vm.ready = true
    },
    async callCreateImage (files) {
      for (let i = 0; i < files.length; i++) {
        await this.createImage(files[i])
      }
    },
    async createImage (file) {
      const reader = new FileReader()
      let vm = this
      reader.onload = (e) => {
        vm.image = e.target.result
        vm.images.push(e.target.result)
      }
      return new Promise(function (resolve, reject) {
        reader.readAsDataURL(file)
        return resolve()
      })
    },
    removeImage: function (e) {
      this.image = ''
    },
    postImage: async function (e) {
      let vm = this
      const res = await axios.post(backendURL + 'data/upload', {
        contentType: vm.selected,
        images: vm.images
      })
      vm.uploadId = res.data.upload_id
    },
    onFileFormatChange (e) {
      console.log(e)
    },
    convertImages: async function (e) {
      let vm = this
      await axios.post(backendURL + 'convert/pdf', {
        contentType: vm.selected,
        uploadId: vm.uploadId
      })

      let statusCode = 404
      while (statusCode === 200) {
        const res = await axios.post(backendURL + 'convert/pdf/download', {
          uploadId: vm.uploadId
        })
        statusCode = res.status
      }
      vm.converted = true
    },
    downloadPDF: async function (e) {
      let vm = this
      const res = await axios.post(backendURL + 'convert/pdf/download', {
        uploadId: vm.uploadId
      }, {responseType: 'blob'})
      let blob = new Blob([res.data], { type: 'application/pdf' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = 'result.pdf'
      link.click()
    }
  }
}
</script>

<style scoped>
  #app {
    text-align: center;
  }

  img {
    width: 30%;
    margin: auto;
    display: block;
    margin-bottom: 10px;
  }

  button {

  }
</style>
