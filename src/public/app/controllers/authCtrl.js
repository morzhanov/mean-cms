angular.module('mainApp')

/**
 * Controller that manages admin login and sign up processes
 */
  .controller('aAuthCtrl', ['$rootScope',
    '$http',
    'Auth',
    'User',
    '$window',
    '$location',
    function ($rootScope, $http, Auth, User, $window, $location) {
      if (Auth.isLoggedIn()) {
        $location.path('/admin/dashboard')
      }

      const vm = this

      console.log('in auth controller')

      vm.userData = {}

      // SET DEFAULT USER DATA FOR DEBUG
      vm.userData.name = 'Vlad'
      vm.userData.surname = 'Morzhanov'
      vm.userData.email = 'vlad.morzhanov@gmail.com'
      vm.userData.site = 'mevics.com'
      vm.userData.password = '2133352'

      // log in user
      vm.performLogIn = function () {
        Auth.login(vm.userData)
          .success(function (data) {
            vm.processing = false

            // if a user successfully logs in, redirect to dashboard page
            if (data.success) {
              const userData = JSON.stringify(data.userData)

              localStorage.setItem('user-data', userData)
              $location.path('/admin/dashboard')
            } else {
              vm.error = data.message
            }
          })
      }

      // sign up user
      vm.performSignUp = function () {
        // use the create function in the userService
        $http.post('/api/admin/signup/', {'user': vm.userData})
          .success(function (data) {
            const userData = JSON.stringify(data.userData)

            localStorage.setItem('user-data', userData)
            $location.path('/admin/dashboard')
          })
      }
    }])
