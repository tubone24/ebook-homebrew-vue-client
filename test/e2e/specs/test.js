// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#FileUpload')
      .assert.elementPresent('#format-select')
      .assert.elementPresent('#selected-format')
      .assert.containsText('#selected-format', 'Image Format:')
      .setValue('#format-select', 'image/png')
      .assert.containsText('#selected-format', 'Image Format: image/png')
      .assert.containsText('h2', 'Select images')
      .assert.elementCount('img', 1)
      .end()
  }
}
