<template>
  <div id="FileUpload">
    <div>
      <select id="format-select" v-model="selected">
        <option disabled value="">Please select one</option>
        <option value="image/png">image/png</option>
        <option value="image/jpeg">image/jpeg</option>
        <option value="image/gif">image/gif</option>
      </select>
      <span id="selected-format">Image Format: {{ selected }}</span>
    </div>
    <div v-if="!image" id="select-not-yet-image">
      <h2>Select images</h2>
      <input id="file-choice" type="file" @change="onFileChange" multiple="multiple" accept="image/*">
    </div>
    <div v-else id="selected-images">
      <img :src="image"/>
      <button id="remove-image" class="btn btn-danger" @click="removeImage">Remove images</button>
      <div v-if="selected && images">
        <button id="post-image" class="btn btn-primary" @click="postImage">Post images</button>
      </div>
      <div v-if="uploadId">
        <span id="upload-id">UploadId: {{ uploadId }}</span>
      </div>
      <div v-if="uploadId">
        <div class="row">
          <div class="col-sm-6">
            <button id="convert-images" class="btn btn-info" @click="convertImages">Convert images</button>
          </div>
          <div v-if="converted" class="col-sm-6">
            <button id="download-pdf-200" class="btn btn-success" @click="downloadPDF">Download PDF</button>
          </div>
          <div v-else class="col-sm-6">
            <button id="download-pdf-404" class="btn btn-warning" @click="downloadPDF">Download PDF</button>
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
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      await this.callCreateImage(files)
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
