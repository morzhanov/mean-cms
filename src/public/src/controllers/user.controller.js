angular.module('app').controller('UserCtrl', UserCtrl)
angular.module('app').controller('UserCreateCtrl', UserCreateCtrl)
angular.module('app').controller('UserEditCtrl', UserEditCtrl)

UserCtrl.$inject = ['User', 'HeightDetect']

function UserCtrl (User, HeightDetect) {
  const vm = this

  HeightDetect.heightDetect()

  vm.defaultUserPhoto = 'assets/img/default-user-photo.png'

  vm.currentUser = {}

  User.current()
    .success((res) => {
      vm.currentUser = res
    })

  vm.getUserPhoto = () => {
    if (vm.currentUser.photo) {
      return vm.userData.photo
    } else {
      return vm.defaultUserPhoto
    }
  }
}

UserCreateCtrl.$inject = ['$rootScope',
  'HeightDetect',
  'User',
  '$location',
  'Auth',
  '$http'
]

function UserCreateCtrl ($rootScope, User, $location, $http) {
  const vm = this

  vm.processing = false

  if ($location.$$path === '/users/create') {
    $http.get('/api/admin')
      .error(function (err) {
        if (err) {
          console.log(err)
        }
        $location.path('/')
      })
  }

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'create'

  // function to create a user
  vm.saveUser = () => {
    vm.processing = true

    // clear the message
    vm.message = ''

    // use the create function in the userService
    User.create(vm.userData)
      .success((data) => {
        vm.processing = false

        // clear the form
        vm.userData = {}
        vm.message = data.message

        $rootScope.$emit('changeUser')
        $rootScope.$emit('invalidateAdminPanel')

        $location.path('/login')
      })
  }
}

UserEditCtrl.$inject = [
  '$rootScope', '$routeParams', 'User',
  'HeightDetect', '$window', 'Upload'
]

function UserEditCtrl ($rootScope, $routeParams, User,
                       HeightDetect, $window, Upload, FileReader) {
  const vm = this

  vm.uploadPhoto = false

  HeightDetect.heightDetect()

  vm.defaultUserPhoto = 'assets/img/default-user-photo.png'

  // variable to hide/show elements of the view
  // differentiates between create or edit pages
  vm.type = 'edit'

  $rootScope.LoadFilePath = (element) => {
    $rootScope.$apply(() => {
      const file = element.files[0]

      const reader = new FileReader()

      reader.onload = function (e) {
        console.log(e)
        vm.photoData = e.target.result

        vm.userData.photo = e.target.result

        angular.element('#user-photo')
          .html(
            '<img ng-src="{{user.userData.photo}}" src="' +
            vm.userData.photo + '" alt="user photo">'
          )

        vm.uploadPhoto = true
      }
      reader.readAsDataURL(file)
    })
  }

  // get the user data for the user you want to edit
  // $routeParams is the way we grab data from the URL
  User.get($routeParams.user_id)
    .success((data) => {
      vm.userData = data

      angular.element('#photo-form')
        .attr('action', '/api/upload/image/user?id=' +
          $routeParams.user_id +
          '&token=' + $window.localStorage.getItem('token') +
          '&username=' + vm.userData.username)

      vm.getUserPhoto()
    })

  vm.getUserPhoto = () => {
    if (vm.userData.photo === undefined) {
      vm.userData.photo = vm.defaultUserPhoto
    }
  }

  // function to save the user
  vm.saveUser = () => {
    vm.processing = true

    vm.message = ''

    /**
     * load image on server
     */
    const uploadPhotoFunc = () => {
      Upload.upload({
        url: '/api/upload/image/user',
        data: {
          photo: {
            userId: $routeParams.user_id,
            data: vm.photoData,
            type: '.' + vm.photoData.substring(
              vm.photoData.indexOf('/') + 1,
              vm.photoData.indexOf(';'))
          }
        }
      }).then((response) => {
        console.log(response)

        updateUser()
      })
    }

    const updateUser = () => {
      // call the userService function to update
      User.update($routeParams.user_id, vm.userData)
        .success(function (data) {
          vm.processing = false

          // bind the message from our API to vm.message
          vm.message = data.message

          $rootScope.$emit('changeUser')
          $rootScope.$emit('invalidateAdminPanel')
        })
        .error(function (data) {
          console.log(data)
          $rootScope.$emit('changeUser')
          $rootScope.$emit('invalidateAdminPanel')
        })
    }

    if (vm.uploadPhoto) {
      vm.uploadPhoto = false

      uploadPhotoFunc()
    } else {
      updateUser()
    }
  }
}
