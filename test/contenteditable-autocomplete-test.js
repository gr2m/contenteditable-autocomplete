/* global describe, beforeEach, it, $ */

// we delete the cached require of '@gr2m/frontend-test-setup'
// to make it work with mocha --watch.
delete require.cache[require.resolve('@gr2m/frontend-test-setup')]
require('@gr2m/frontend-test-setup')

var expect = require('chai').expect

function toValue (result) {
  if (typeof result !== 'object') {
    return result
  }

  if (isError(result.value)) {
    var error = new Error(result.value.message)
    Object.keys(result.value).forEach(function (key) {
      error[key] = result.value[key]
    })
    throw error
  }

  return result.value
}

function isError (value) {
  return value && value.name && /error/i.test(value.name)
}

describe('=== expandable-input ===', function () {
  this.timeout(90000)

  beforeEach(function () {
    return this.client.url('/')
  })

  it('sanity check', function () {
    return this.client
      .url('/index.html')
      .execute(function getTitle () {
        return document.title
      }).then(toValue)
      .then(function (title) {
        expect(title).to.equal('Contenteditable Autocomplete – A jQuery plugin')
      })
  })

  it('suggestions occur when starting to type', function () {
    return this.client
      .click('[name="example-single"]')
      .keys('a')
      .waitForVisible('.suggestions', 3000)
      .isVisible('.suggestions').then(toValue)
      .then(function (isVisiable) {
        expect(isVisiable).to.equal(true)
      })
  })

  it('click on suggestion sets value', function () {
    return this.client
      .click('[name="example-single"]')
      .keys('a')
      .click('div=Afghanistan')
      // .getValue() is not working, as the selector is not an input
      // but a contenteditable
      .execute(function () {
        return $('[name="example-single"]').val()
      }).then(toValue)
      .then(function (text) {
        expect(text).to.equal('Afghanistan')
      })
  })

  it('enter sets value to first suggestion', function () {
    return this.client
      .click('[name="example-single"]')
      .keys('x')
      .keys('Enter')
      .execute(function () {
        return $('[name="example-single"]').val()
      }).then(toValue)
      .then(function (text) {
        expect(text).to.equal('Luxembourg')
      })
  })

  it('input with data-autocomplete-multiple accepts adds values separated by ,', function () {
    return this.client
      .click('[name="example-multi"]')
      .keys(['a', 'Enter'])
      .execute(function () {
        return $('[name="example-multi"]').val()
      }).then(toValue)
      .then(function (text) {
        expect(text).to.equal('Afghanistan,')
      })
      .keys(['b', 'Enter'])
      .execute(function () {
        return $('[name="example-multi"]').val()
      }).then(toValue)
      .then(function (text) {
        expect(text).to.equal('Afghanistan, Albania,')
      })
  })
})
