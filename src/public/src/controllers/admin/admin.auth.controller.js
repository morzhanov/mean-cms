angular.module('app').controller('AdAuthCtrl', AdAuthCtrl)

AdAuthCtrl.$inject = [
  '$rootScope',
  '$http',
  'Auth',
  'User',
  '$window',
  '$location'
]

function AdAuthCtrl ($http, Auth, $location) {
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
  vm.performLogIn = () => {
    Auth.login(vm.userData)
      .success((data) => {
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
  vm.performSignUp = () => {
    // use the create function in the userService
    $http.post('/api/admin/signup/', {'user': vm.userData})
      .success((data) => {
        const userData = JSON.stringify(data.userData)

        localStorage.setItem('user-data', userData)
        $location.path('/admin/dashboard')
      })
  }
}
