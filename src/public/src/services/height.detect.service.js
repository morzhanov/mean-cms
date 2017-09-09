angular.module('app').service('HeightDetect', HeightDetect)

function HeightDetect () {
  const instance = this

  // get a single user
  this.heightDetect = function () {
    const h = $('.height-detect')
    h.css('height', $(window).height())
    h.attr('height', $(window).height())
    $('#dashboard-container').css('height', $(document).height())
  }

  $(document).ready(function () {
    instance.heightDetect()
  })
}
