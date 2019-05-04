// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

const path = require('path')
const file = path.resolve(__dirname, '../files/test_001.png')

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.title('ebook-homebrew-vue-client')
      .assert.elementPresent('#FileUpload')
      .assert.elementPresent('#format-select')
      .assert.elementPresent('#selected-format')
      .assert.containsText('#selected-format', 'Image Format:')
      .setValue('#format-select', 'image/png')
      .assert.containsText('#selected-format', 'Image Format: image/png')
      .assert.containsText('h2', 'Select images')
      .assert.elementCount('img', 1)
      .setValue('#file-choice', file)
      .assert.elementCount('img', 2)
      .click('#remove-image')
      .assert.elementCount('img', 1)
      .setValue('#file-choice', file)
      .click('#post-image')
      .waitForElementVisible('#upload-id', 60000)
      .assert.elementPresent('#convert-images')
      .assert.elementPresent('#download-pdf-404')
      .click('#convert-images')
      .waitForElementVisible('#download-pdf-200', 60000)
      .click('#download-pdf-200')
      .pause(5000)
      .assert.elementPresent('#download-pdf-200')
      .end()
  }
}
