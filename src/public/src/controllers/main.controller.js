angular.module('app').controller('MainCtrl', MainCtrl)

MainCtrl.$inject = [
  '$rootScope',
  'HeightDetect'
]

function MainCtrl ($rootScope, HeightDetect) {
  const vm = this

  if (localStorage.getItem('is-nav-menu')) {
    vm.navMenuUrl = 'app/views/public/nav-menu.html'
  } else {
    vm.navMenuUrl = null
  }

  $rootScope.$on('show-nav-menu', () => {
    vm.navMenuUrl = 'app/views/public/nav-menu.html'
  })

  $rootScope.$on('hide-nav-menu', () => {
    vm.navMenuUrl = null
  })

  vm.topNavUrl = null

  if (localStorage.getItem('top-nav')) {
    vm.topNavUrl = localStorage.getItem('top-nav')
  }

  HeightDetect.heightDetect()

  initLoaderView()

  vm.isA = () => {
    return false
  }
}

// method that manage site loader view visibility
function initLoaderView () {
  angular.element(document).ready(() => {
    angular.element('.loader_inner').fadeOut()
    angular.element('.loader').delay(400).fadeOut('slow')
  })
}
