webpackJsonp([0], [
  /* 0 */,
  /* 1 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    __webpack_require__(2)
    var angular = __webpack_require__(0)

    angular.module('app', ['ngAnimate', // animating
      'a.routes', 'routes', 'ui.bootstrap', 'ngParallax', // parallax effect
      'ngFileUpload'])
    // application configuration to integrate token into requests
      .config(function ($httpProvider, $locationProvider) {
        // attach our auth interceptor to the http requests
        $httpProvider.interceptors.push('AuthInterceptor')

        $locationProvider.html5Mode(true).hashPrefix('!')
      })

    /***/
  }),
  /* 2 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    __webpack_require__(3)
    __webpack_require__(4)
    __webpack_require__(16)
    __webpack_require__(28)
    __webpack_require__(30)

    /***/
  }),
  /* 3 */
  /***/ (function (module, exports) {

// removed by extract-text-webpack-plugin

    /***/
  }),
  /* 4 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    __webpack_require__(5)
    __webpack_require__(6)
    __webpack_require__(7)
    __webpack_require__(8)
    __webpack_require__(9)
    __webpack_require__(10)
    __webpack_require__(11)
    __webpack_require__(13)
    __webpack_require__(14)
    __webpack_require__(15)

    /***/
  }),
  /* 5 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('AuthCtrl', AuthCtrl)

    AuthCtrl.$inject = ['$http', 'Auth', '$location']

    function AuthCtrl ($http, Auth, $location) {
      if (Auth.isLoggedIn()) {
        $location.path('/admin/dashboard')
      }

      var vm = this

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
        Auth.login(vm.userData).success(function (data) {
          vm.processing = false

          // if a user successfully logs in, redirect to dashboard page
          if (data.success) {
            var userData = JSON.stringify(data.userData)

            localStorage.setItem('user-data', userData)
            $location.path('/admin/dashboard')
          } else {
            vm.error = data.message
      }
        });
      };

      // sign up user
      vm.performSignUp = function () {
        // use the create function in the userService
        $http.post('/api/admin/signup/', {'user': vm.userData}).success(function (data) {
          var userData = JSON.stringify(data.userData)

          localStorage.setItem('user-data', userData)
          $location.path('/admin/dashboard')
        })
      }
    }

    /***/
  }),
  /* 6 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('MainCtrl', MainCtrl)

    MainCtrl.$inject = ['$rootScope', 'HeightDetect']

    function MainCtrl ($rootScope, HeightDetect) {
      var vm = this

      if (localStorage.getItem('is-nav-menu')) {
        vm.navMenuUrl = 'app/views/public/nav-menu.html'
      } else {
        vm.navMenuUrl = null
      }

      $rootScope.$on('show-nav-menu', function () {
        vm.navMenuUrl = 'app/views/public/nav-menu.html'
      })

      $rootScope.$on('hide-nav-menu', function () {
        vm.navMenuUrl = null
      })

      vm.topNavUrl = null

      if (localStorage.getItem('top-nav')) {
        vm.topNavUrl = localStorage.getItem('top-nav')
      }

      HeightDetect.heightDetect()

      initLoaderView()

      vm.isA = function () {
        return false
      }
    }

// method that manage site loader view visibility
    function initLoaderView () {
      angular.element(document).ready(function () {
        angular.element('.loader_inner').fadeOut()
        angular.element('.loader').delay(400).fadeOut('slow')
      })
    }

    /***/
  }),
  /* 7 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('PageCtrl', PageCtrl)

    PageCtrl.$inject = ['$rootScope', '$window', 'Page']

    function PageCtrl ($rootScope, $window, Page) {
    }

    /***/
  }),
  /* 8 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('PostCtrl', PostCtrl)

    PostCtrl.$inject = ['$rootScope', '$window', 'Post']

    function PostCtrl ($rootScope, $window, Post) {
    }

    /***/
  }),
  /* 9 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('UserCtrl', UserCtrl)
    angular.module('app').controller('UserCreateCtrl', UserCreateCtrl)
    angular.module('app').controller('UserEditCtrl', UserEditCtrl)

    UserCtrl.$inject = ['User', 'HeightDetect']

    function UserCtrl (User, HeightDetect) {
      var vm = this

      HeightDetect.heightDetect()

      vm.defaultUserPhoto = 'assets/img/default-user-photo.png'

      vm.currentUser = {}

      User.current().success(function (res) {
        vm.currentUser = res
      })

      vm.getUserPhoto = function () {
        if (vm.currentUser.photo) {
          return vm.userData.photo
        } else {
          return vm.defaultUserPhoto
        }
      }
    }

    UserCreateCtrl.$inject = ['$rootScope', 'HeightDetect', 'User', '$location', 'Auth', '$http']

    function UserCreateCtrl ($rootScope, User, $location, $http) {
      var vm = this

      vm.processing = false

      if ($location.$$path === '/users/create') {
        $http.get('/api/admin').error(function (err) {
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
      vm.saveUser = function () {
        vm.processing = true

        // clear the message
        vm.message = ''

        // use the create function in the userService
        User.create(vm.userData).success(function (data) {
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

    UserEditCtrl.$inject = ['$rootScope', '$routeParams', 'User', 'HeightDetect', '$window', 'Upload']

    function UserEditCtrl ($rootScope, $routeParams, User, HeightDetect, $window, Upload, FileReader) {
      var vm = this

      vm.uploadPhoto = false

      HeightDetect.heightDetect()

      vm.defaultUserPhoto = 'assets/img/default-user-photo.png'

      // variable to hide/show elements of the view
      // differentiates between create or edit pages
      vm.type = 'edit'

      $rootScope.LoadFilePath = function (element) {
        $rootScope.$apply(function () {
          var file = element.files[0]

          var reader = new FileReader()

          reader.onload = function (e) {
            console.log(e)
            vm.photoData = e.target.result

            vm.userData.photo = e.target.result

            angular.element('#user-photo').html('<img ng-src="{{user.userData.photo}}" src="' + vm.userData.photo + '" alt="user photo">')

            vm.uploadPhoto = true
          }
          reader.readAsDataURL(file)
        })
      }

      // get the user data for the user you want to edit
      // $routeParams is the way we grab data from the URL
      User.get($routeParams.user_id).success(function (data) {
        vm.userData = data

        angular.element('#photo-form').attr('action', '/api/upload/image/user?id=' + $routeParams.user_id + '&token=' + $window.localStorage.getItem('token') + '&username=' + vm.userData.username)

        vm.getUserPhoto()
      })

      vm.getUserPhoto = function () {
        if (vm.userData.photo === undefined) {
          vm.userData.photo = vm.defaultUserPhoto
        }
      }

      // function to save the user
      vm.saveUser = function () {
        vm.processing = true

        vm.message = ''

        /**
         * load image on server
         */
        var uploadPhotoFunc = function uploadPhotoFunc () {
          Upload.upload({
            url: '/api/upload/image/user',
            data: {
              photo: {
                userId: $routeParams.user_id,
                data: vm.photoData,
                type: '.' + vm.photoData.substring(vm.photoData.indexOf('/') + 1, vm.photoData.indexOf(';'))
              }
            }
          }).then(function (response) {
            console.log(response)

            updateUser()
          })
        }

        var updateUser = function updateUser () {
          // call the userService function to update
          User.update($routeParams.user_id, vm.userData).success(function (data) {
            vm.processing = false

            // bind the message from our API to vm.message
            vm.message = data.message

            $rootScope.$emit('changeUser')
            $rootScope.$emit('invalidateAdminPanel')
          }).error(function (data) {
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

    /***/
  }),
  /* 10 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('AdAuthCtrl', AdAuthCtrl)

    AdAuthCtrl.$inject = ['$rootScope', '$http', 'Auth', 'User', '$window', '$location']

    function AdAuthCtrl ($http, Auth, $location) {
      if (Auth.isLoggedIn()) {
        $location.path('/admin/dashboard')
      }

      var vm = this

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
        Auth.login(vm.userData).success(function (data) {
          vm.processing = false

          // if a user successfully logs in, redirect to dashboard page
          if (data.success) {
            var userData = JSON.stringify(data.userData)

            localStorage.setItem('user-data', userData)
            $location.path('/admin/dashboard')
          } else {
            vm.error = data.message
      }
        });
      };

      // sign up user
      vm.performSignUp = function () {
        // use the create function in the userService
        $http.post('/api/admin/signup/', {'user': vm.userData}).success(function (data) {
          var userData = JSON.stringify(data.userData)

          localStorage.setItem('user-data', userData)
          $location.path('/admin/dashboard')
        })
      }
    }

    /***/
  }),
  /* 11 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('AdDashboardCtrl', AdDashboardCtrl)

    AdDashboardCtrl.$inject = ['$rootScope', 'Auth', '$location', 'aUser', 'siteService']

    function AdDashboardCtrl ($rootScope, Auth, $location, aUser, siteService) {
      var vm = this

      vm.templateUrl = __webpack_require__(12)

      vm.contentUrl = 'app/views/admin/home.html'

      if ($location.path().substr(0, 6) === '/admin') {
        $rootScope.$emit('hide-nav-menu')
      } else {
        $rootScope.$emit('show-nav-menu')
      }

      // to justify viewport height
      $('.height-detect').css('height', $(window).height())

      // if user not logged in go to login page
      if (!Auth.isLoggedIn()) {
        $location.path('/admin/login')
      }

      localStorage.setItem('top-nav', 'app/views/admin/topNav.html')

      // Admin user Log Out method
      vm.doLogout = function () {
        Auth.logout()
        //  reset all user info
        vm.user = {}
        $location.path('/admin/login')
      }

      console.log('in admin dashboard controller')

      // set current content view as Home
      if (!localStorage.getItem('dashboard-content')) {
        vm.contentUrl = 'app/views/admin/home.html'
        localStorage.setItem('dashboard-content', vm.contentUrl)
      } else {
        vm.contentUrl = localStorage.getItem('dashboard-content')
      }

      // get site settings
      vm.siteSettings = {
        title: siteService.getSiteTitle(),
        url: siteService.getSiteUrl()

        // get data of current user
      }
      aUser.current().success(function (data) {
        vm.userData = data
      })

      vm.toSiteHome = function () {
        $rootScope.$emit('show-nav-menu')
        $location.path('/')
      }

      vm.toDashboard = function () {
        $rootScope.$emit('hide-nav-menu')
        $location.path('/admin/dashboard')
      }

      // methods toggles styles of dashboard menu items
      vm.toggleActiveClass = function (element) {
        angular.element('.dshd-menu-child-item a').css('color', '#fff')

        angular.element(element).css('color', '#ff904e')
      }

      /**
       * Dashboard menu selectors methods
       */

      // Home menu section

      // go to home screen
      vm.toHome = function () {
        vm.toggleActiveClass('.btn-home')

        vm.contentUrl = 'app/views/admin/home.html'

        localStorage.setItem('dashboard-content', vm.contentUrl)
      }

      // Pages menu section

      // show all pages
      vm.allPages = function () {
        vm.toggleActiveClass('.btn-all-pages')

        vm.contentUrl = 'app/views/admin/page/all.html'

        localStorage.setItem('dashboard-content', vm.contentUrl)
      }

      // create new page
      vm.createPage = function ($event) {
        // to stop bubbles effect
        if ($event !== undefined) {
          $event.stopPropagation()
        }

        vm.toggleActiveClass('.btn-create-page')

        vm.contentUrl = 'app/views/admin/page/single.html'

        localStorage.setItem('single-page-edit-type', 'create')

        localStorage.setItem('dashboard-content', vm.contentUrl)
      }

      // Posts menu section

      // get all posts
      vm.allPosts = function () {
        vm.toggleActiveClass('.btn-all-posts')

        vm.contentUrl = 'app/views/admin/post/all.html'

        localStorage.setItem('dashboard-content', vm.contentUrl)
      }

      // create new post
      vm.createPost = function ($event) {
        // to stop bubbles effect
        if ($event !== undefined) {
          $event.stopPropagation()
        }

        $rootScope.$emit('toggleEditPostView')

        vm.toggleActiveClass('.btn-create-post')

        vm.contentUrl = 'app/views/admin/post/single.html'

        localStorage.setItem('single-post-edit-type', 'create')

        localStorage.setItem('dashboard-content', vm.contentUrl)
      }

      // Settings menu items

      // All Users
      vm.allUsers = function () {
        vm.contentUrl = 'app/views/admin/user/all.html'

        localStorage.setItem('dashboard-content', vm.contentUrl)

        aUser.all().success(function (data) {
          // bind the users that come back to vm.users
          vm.users = data

          // set a processing variable to show loading things
          vm.processing = true

          for (var i = 0; i < vm.users.length; ++i) {
            if (vm.users[i].site === undefined) {
              continue
            }
            if (vm.users[i].site.length > 40) {
              vm.users[i].siteAlias = vm.users[i].site.substring(0, 40) + '...'
            } else {
              vm.users[i].siteAlias = vm.users[i].site
            }
      }
        });
      };

      vm.createNewUser = function () {
        vm.contentUrl = 'app/views/admin/user/single.html'

        localStorage.setItem('dashboard-content', vm.contentUrl)
        localStorage.setItem('user-edit-type', 'create')
      }

      vm.editUser = function (id) {
        vm.contentUrl = 'app/views/admin/user/single.html'

        localStorage.setItem('user-id-to-edit', id)
        localStorage.setItem('dashboard-content', vm.contentUrl)
        localStorage.setItem('user-edit-type', 'edit')
      }

      // PAGE EVENTS
      $rootScope.$on('changeDashboardContent', function () {
        vm.contentUrl = localStorage.getItem('dashboard-content')
      })
    }

    /***/
  }),
  /* 12 */
  /***/ (function (module, exports) {

    var angular = window.angular, ngModule
    try {
      ngModule = angular.module(['ng'])
    }
    catch (e) {
      ngModule = angular.module('ng', [])
    }
    var v1 = '<nav class="navbar user-navbar" ng-controller="AdDashboardCtrl as dashboard">\n<div class="navbar-header">\n<a ng-click="dashboard.toDashboard()" class="navbar-brand">\n<span class="fa nav-logo fa-code text-danger"></span>Dashboard\n</a>\n<a ng-click="dashboard.toSiteHome()" class="navbar-to-site">Go to\n<span class="site-title">{{dashboard.siteSettings.title}}</span>\n</a>\n</div>\n<ul class="nav navbar-nav navbar-right">\n<li class="user-hello navbar-text">Hello {{dashboard.userData.name}} !\n</li>\n<li>\n<a ng-href="/account" class="navbar-user-photo-reference">\n<img class="navbar-user-photo" ng-src="{{dashboard.userData.photo}}" alt="User Photo">\n</a>\n</li>\n<li>\n<a class="logout-button" ng-click="dashboard.doLogout()">Log Out\n</a>\n</li>\n</ul>\n</nav>\n'
    var id1 = 'views/admin/topNav.html'
    var inj = angular.element(window.document).injector()
    if (inj) {
      inj.get('$templateCache').put(id1, v1)
    }
    else {
      ngModule.run(['$templateCache', function (c) {
        c.put(id1, v1)
      }])
    }
    module.exports = v1

    /***/
  }),
  /* 13 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('AdPageCtrl', AdPageCtrl)
    angular.module('app').controller('AdPageEditCtrl', AdPageEditCtrl)

    AdPageCtrl.$inject = ['aPageCtrl', '$rootScope', '$window', 'aPage']

    function AdPageCtrl ($rootScope, $window, aPage) {
      var vm = this

      vm.processing = true

      // get all pages
      vm.getAllPages = function () {
        aPage.all().success(function (data) {
          vm.pages = data

          vm.processing = false
        })
      }

      vm.getAllPages()

      vm.editPage = function (id) {
        $window.localStorage.setItem('edit-page-id', id)

        $window.localStorage.setItem('dashboard-content', 'app/views/admin/page/single.html')

        $window.localStorage.setItem('single-page-edit-type', 'edit')

        $rootScope.$emit('changeDashboardContent')
      }

      vm.deletePage = function (id) {
        aPage.delete(id).success(function () {
          alert('page successfully deleted!')

          vm.getAllPages()
        })
      }
    }

    AdPageEditCtrl.$inject = ['$rootScope', '$window', 'aPage', 'aPost', 'siteService']

    function AdPageEditCtrl ($rootScope, $window, aPage, aPost, siteService) {
      // also for page creating
      var vm = this

      vm.id = $window.localStorage.getItem('edit-page-id')

      vm.type = $window.localStorage.getItem('single-page-edit-type')

      vm.message = ''

      vm.pageData = {}

      vm.allPostsTemplate = 'app/views/admin/page/pagePosts.html'

      $rootScope.$on('toggleEditPageView', function () {
        vm.pageData = {}
        vm.type = 'create'
      })

      // if it's edit type get post from server and fill fields
      if (vm.type === 'edit') {
        aPage.get(vm.id).success(function (data) {
          vm.pageData.title = data.title
          vm.pageData.contentHeader = data.contentHeader
          vm.pageData.contentFooter = data.contentFooter
          vm.pageData.url = data.url
          vm.pageData.date = data.date

          aPage.allPosts(vm.id).success(function (posts) {
            vm.pageData.posts = posts
          })
        })
      } else {
        vm.pageData.title = 'Example page Title'
        vm.pageData.contentFooter = 'Example page Footer Content'
        vm.pageData.contentHeader = 'Example page Header Content'
        vm.pageData.url = siteService.getSiteUrl() + 'example_page_url'
        vm.pageData.date = new Date()
      }

      /**
       * remove element from angular model
       */
      vm.deletePostFromPage = function (pageId, postId) {
        var idx = vm.pageData.posts.indexOf(postId)

        if (idx > -1) {
          vm.pageData.posts.splice(idx, 1)
        }

        /**
         * remove element from servers model
         */
        aPage.deletePostFromPage(pageId, postId).success(function () {
          aPage.allPosts(vm.id).success(function (posts) {
            vm.pageData.posts = posts
            vm.message = 'Post with id = ' + postId + ' successfully deleted from current page!'
          })
        })
      }

      vm.savePage = function () {
        if (vm.type === 'edit') {
          aPage.update(vm.id, vm.pageData).success(function () {
            vm.message = 'Page successfully edited!'
          })
        } else {
          aPage.create(vm.pageData).success(function () {
            vm.message = 'Page successfully created!'
          })
        }
      }

      vm.toggleAddPostMenu = false

      vm.addPost = function () {
        if (!vm.toggleAddPostMenu) {
          angular.element('.btn-add-page-post').html('-')

          /**
           * delete from all posts posts, that already
           * present on current page
           */
          aPost.all().success(function (data) {
            if (vm.pageData) {
              if (vm.pageData.posts) {
                if (vm.pageData.posts.length > 0) {
                  for (var i = 0; i < data.length; ++i) {
                    for (var j = 0; j < vm.pageData.posts.length; ++j) {
                      if (data[i]._id === vm.pageData.posts[j]._id) {
                        data.splice(i, 1)
                        --i
                        break
                      }
                    }
                  }
                }
              }
            }

            if (data.length === 0) {
              vm.allPosts = undefined
            } else {
              vm.allPosts = data
            }
          })
        } else {
          angular.element('.btn-add-page-post').html('+')
        }

        vm.toggleAddPostMenu = !vm.toggleAddPostMenu
      }

      vm.addThisPost = function (id) {
        if (vm.pageData.posts === undefined) {
          vm.pageData.posts = []
        }

        aPost.get(id).success(function (post) {
          vm.pageData.posts.push(post)

          aPage.update(vm.id, vm.pageData).success(function () {
            vm.message = 'Post successfully added to page!'
          })
        })
      }
    }

    /***/
  }),
  /* 14 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('AdPostCtrl', AdPostCtrl)
    angular.module('app').controller('AdPostEditCtrl', AdPostEditCtrl)

    AdPostCtrl.$inject = ['aPostCtrl', '$rootScope', '$window', 'aPost']

    function AdPostCtrl ($rootScope, $window, aPost) {
      var vm = this

      vm.processing = true

      // get all posts
      vm.getAllPosts = function () {
        aPost.all().success(function (data) {
          vm.posts = data

          for (var i = 0; i < vm.posts.length; ++i) {
            if (vm.posts[i].content.length > 40) {
              vm.posts[i].desc = vm.posts[i].content.substring(0, 39)
            } else {
              vm.posts[i].desc = vm.posts[i].content
            }
          }

          vm.processing = false
        })
      }

      vm.getAllPosts()

      vm.editPost = function (id) {
        $window.localStorage.setItem('edit-post-id', id)

        $window.localStorage.setItem('dashboard-content', 'app/views/admin/post/single.html')

        $window.localStorage.setItem('single-post-edit-type', 'edit')

        $rootScope.$emit('changeDashboardContent')
      }

      vm.deletePost = function (id) {
        aPost.delete(id).success(function () {
          alert('post successfully deleted!')

          vm.getAllPosts()
        })
      }
    }

    AdPostEditCtrl.$inject = ['$rootScope', '$window', 'aPost']

    function AdPostEditCtrl ($rootScope, $window, aPost) {
      // also for post creating
      var vm = this

      vm.message = ''

      vm.postId = $window.localStorage.getItem('edit-post-id')

      vm.type = $window.localStorage.getItem('single-post-edit-type')

      vm.postData = {}

      $rootScope.$on('toggleEditPostView', function () {
        vm.postData = {}
        vm.type = 'create'
      })

      // if it's edit type get post from server and fill fields
      if (vm.type === 'edit') {
        aPost.get(vm.postId).success(function (data) {
          vm.postData.title = data.title
          vm.postData.content = data.content
          vm.postData.date = data.date
        })
      }

      vm.savePost = function () {
        if (vm.type === 'edit') {
          aPost.update(vm.postId, vm.postData).success(function () {
            vm.message = 'Post successfully edited!'
          })
        } else {
          aPost.create(vm.postData).success(function () {
            vm.message = 'Post successfully created!'
          })
        }
      }
    }

    /***/
  }),
  /* 15 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').controller('AdUserCtrl', AdUserCtrl)
    angular.module('app').controller('AdUserEditCtrl', AdUserCtrl)

    AdUserCtrl.$inject = ['aUser']

    function AdUserCtrl (aUser) {
      var vm = this

      // set a processing variable to show loading things
      vm.processing = true

      // grab all users at page load
      aUser.all().success(function (data) {
        // bind the users that come back to vm.users
        vm.users = data

        for (var i = 0; i < vm.users.length; ++i) {
          if (vm.users[i].site === undefined) {
            continue
          }
          if (vm.users[i].site.length > 40) {
            vm.users[i].siteAlias = vm.users[i].site.substring(0, 40) + '...'
          } else {
            vm.users[i].siteAlias = vm.users[i].site
          }
        }

        // when all the users come back, remove the processing variable
        vm.processing = false
      })

      // function to delete a user
      vm.deleteUser = function (id) {
        vm.processing = true

        // accepts the user id as a parameter
        aUser.delete(id).success(function () {
          //  get all users to update the table
          //  you can also set up your api
          //  to return the list of users with the delete call
          aUser.all().success(function (data) {
            vm.processing = false
            vm.users = data
          })

          alert('User successfully deleted !')
        })
      }
    }

    AdUserEditCtrl.$inject = ['$rootScope', '$routeParams', 'aUser', 'Upload']

    function AdUserEditCtrl ($rootScope, $routeParams, aUser, Upload) {
      var vm = this

      vm.defaultUserPhoto = 'assets/img/default-user-photo.png'

      vm.type = localStorage.getItem('user-edit-type')

      vm.getUserPhoto = function () {
        if (vm.userData.photo === undefined) {
          vm.userData.photo = vm.defaultUserPhoto
        }
      }

      if (vm.type === 'edit') {
        //  get the user data for the user you want to edit
        //  $routeParams is the way we grab data from the URL
        aUser.get(localStorage.getItem('user-id-to-edit')).success(function (data) {
          vm.userData = data

          angular.element('#photo-form').attr('action', '/api/admin/upload/image/user?id=' + vm.userData.id + '&token=' + localStorage.getItem('token') + '&email=' + vm.userData.email)

          vm.getUserPhoto()
        })
      } else {
        vm.userData = {}
      }

      $rootScope.LoadFilePath = function (element) {
        $rootScope.$apply(function () {
          var file = element.files[0]

          var reader = new FileReader()

          reader.onload = function (e) {
            console.log(e)
            vm.photoData = e.target.result

            vm.userData.photo = e.target.result

            angular.element('#user-photo').html('<img ng-src="{{user.userData.photo}}" src="' + vm.userData.photo + '" alt="user photo">')

            vm.uploadPhoto = true
          }
          reader.readAsDataURL(file)
        })
      }

      vm.updateUser = function () {
        if (vm.uploadPhoto) {
          vm.uploadPhoto = false

          uploadPhotoFunc()
        } else {
          // call the userService function to update
          aUser.update(localStorage.getItem('user-id-to-edit'), vm.userData).success(function (data) {
            localStorage.setItem('userData', JSON.stringify(data.userData))

            vm.processing = false

            // bind the message from our API to vm.message
            vm.message = data.message
          }).error(function (data) {
            console.log(data)
          })
        }
      }

      vm.createNewUser = function () {
        // temporary
        vm.userData.photo = null

        aUser.create(vm.userData).success(function (data) {
          vm.processing = false

          // clear the form
          vm.userData = {}
          vm.message = data.message
        })
      }

      // function to save the user
      vm.saveUser = function () {
        vm.processing = true

        vm.message = ''

        if (vm.type === 'create') {
          vm.createNewUser()
        } else {
          vm.updateUser()
        }
      }

      var uploadPhotoFunc = function uploadPhotoFunc () {
        /**
         * load image on server
         */
        Upload.upload({
          url: '/api/admin/upload/image/user',
          data: {
            photo: {
              userId: $routeParams.user_id,
              data: vm.photoData,
              type: '.' + vm.photoData.substring(vm.photoData.indexOf('/') + 1, vm.photoData.indexOf(';'))
            }
          }
        }).then(function (response) {
          console.log(response)

          vm.updateUser()
        })
      }
    }

    /***/
  }),
  /* 16 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    __webpack_require__(17)
    __webpack_require__(18)
    __webpack_require__(19)
    __webpack_require__(20)
    __webpack_require__(21)
    __webpack_require__(22)
    __webpack_require__(23)
    __webpack_require__(24)
    __webpack_require__(25)
    __webpack_require__(26)
    __webpack_require__(27)

    /***/
  }),
  /* 17 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('AuthService', AuthService)
    angular.module('app').factory('AuthTokenService', AuthTokenService)
    angular.module('app').factory('AuthInterceptorService', AuthInterceptorService)

    AuthService.$inject = ['$http', '$q', 'AuthToken']

    function AuthService ($http, $q, AuthToken) {
      // create auth factory object
      var authFactory = {}

      // log a user in
      authFactory.login = function (user) {
        // return the promise object and its data
        return $http.post('/api/admin/login', {
          'user': user
        }).success(function (data) {
          AuthToken.setToken(data.token)
          return data
        })
      }

      // log a user out by clearing the token
      authFactory.logout = function () {
        // clear the token
        AuthToken.setToken()
      }

      // check is user logged in
      // checks if there is a local token and validates it
      authFactory.isLoggedIn = function () {
        return !!AuthToken.getToken()
      }

      // get the logged in user
      authFactory.getUser = function () {
        if (AuthToken.getToken()) {
          return $http.get('/api/me', {cache: true})
        } else {
          return $q.reject({message: 'User has no token.'})
        }
      }

      // return auth factory object
      return authFactory
    }

    AuthTokenService.$inject = ['$window']

    function AuthTokenService ($window) {
      return {
        // get the token out of local storage
        getToken: function getToken () {
          return localStorage.getItem('access_token')
        },
        // set the token or clear the token
        // if a token is passed, set the token
        // if there is no token, clear it from local storage
        setToken: function setToken (token) {
          if (token) {
            $window.localStorage.setItem('access_token', token)
          } else {
            $window.localStorage.removeItem('access_token')
          }
        }
      }
    }

    AuthInterceptorService.$inject = ['$q', '$location', 'AuthToken']

    function AuthInterceptorService ($q, $location, AuthToken) {
      var interceptorFactory = {}

      // attach the token to every request
      interceptorFactory.request = function (config) {
        // grab the token
        var token = AuthToken.getToken()

        // if the token exists, add it to the header as x-access-token
        if (token) {
          config.headers['x-access-token'] = token
        }

        return config
      }

      // redirect if a token doesn't authenticate
      // happens on response errors
      interceptorFactory.responseError = function (response) {
        // if out server returns a 403 forbidden response
        if (response.status === 403) {
          AuthToken.setToken()
          $location.path('/login')
        }

        // return the errors from the server as a promise
        return $q.reject(response)
      }

      return interceptorFactory
    }

    /***/
  }),
  /* 18 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('PageService', PageService)

    PageService.$inject = ['$http', 'Auth', '$location', '$q']

    function PageService ($http) {
      //  create a new object
      var pageFactory = {}

      //  get a single page
      pageFactory.get = function (id) {
        return $http.get('/api/pages/' + id)
      }

      //  get all pages
      pageFactory.all = function () {
        return $http.get('/api/pages/')
      }

      //  get a single post
      pageFactory.getSinglePost = function (pageId, postId) {
        return $http.get('/api/pages/' + pageId + '/posts/' + postId)
      }

      //  get all posts
      pageFactory.allPosts = function (pageId) {
        return $http.get('/api/pages/' + pageId + '/posts/')
      }

      //  return our entire pageFactory object
      return pageFactory
    }

    /***/
  }),
  /* 19 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('PostService', PostService)

    PostService.$inject = ['$http', 'Auth', '$location', '$q']

    function PostService ($http) {
      // create a new object
      var postFactory = {}

      // get a single post
      postFactory.get = function (id) {
        return $http.get('/api/posts/' + id)
      }

      // get all posts
      postFactory.all = function () {
        return $http.get('/api/posts/')
      }

      // return our entire postFactory object
      return postFactory
    }

    /***/
  }),
  /* 20 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('UserService', UserService)

    UserService.$inject = ['$http', 'Auth', '$location', '$q']

    function UserService ($http) {
      // create a new object
      var userFactory = {}

      userFactory.currentUser = {}

      // get a single user
      userFactory.get = function (id) {
        return $http.get('/api/users/' + id)
      }

      // get all users
      userFactory.all = function () {
        return $http.get('/api/users/')
      }

      // create a user
      userFactory.create = function (userData) {
        return $http.post('/api/users/', userData)
      }

      // update a user
      userFactory.update = function (id, userData) {
        return $http.put('/api/users/' + id, userData)
      }

      // delete a user
      userFactory.delete = function (id) {
        return $http.delete('/api/users/' + id)
      }

      // get current user
      userFactory.current = function () {
        return $http.get('/api/me/')
      }

      // return our entire userFactory object
      return userFactory
    }

    /***/
  }),
  /* 21 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('SiteSettingsService', SiteSettingsService)

    function SiteSettingsService () {
      var siteServiceFactory = {}

      siteServiceFactory.siteSettings = {}

      /**
       * Get site url from server
       */
      siteServiceFactory.siteSettings.url = 'localhost:8080/'

      /**
       * Get site title from server
       */
      siteServiceFactory.siteSettings.title = 'Perfect site'

      siteServiceFactory.getSiteTitle = function () {
        return siteServiceFactory.siteSettings.title
      }

      siteServiceFactory.getSiteUrl = function () {
        return siteServiceFactory.siteSettings.url
      }

      return siteServiceFactory
    }

    /***/
  }),
  /* 22 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').service('HeightDetect', HeightDetect)

    function HeightDetect () {
      var instance = this

      // get a single user
      this.heightDetect = function () {
        var h = $('.height-detect')
        h.css('height', $(window).height())
        h.attr('height', $(window).height())
        $('#dashboard-container').css('height', $(document).height())
      }

      $(document).ready(function () {
        instance.heightDetect()
      })
    }

    /***/
  }),
  /* 23 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('AdminAuthService', AdminAuthService).factory('AdminAuthTokenService', AdminAuthTokenService).factory('AdminAuthInterceptService', AdminAuthInterceptService)

    AdminAuthService.$inject = ['$http', '$q', 'AuthToken']

    function AdminAuthService ($http, $q, AuthToken) {
      // create auth factory object
      var authFactory = {}

      // log a user in
      authFactory.login = function (user) {
        // return the promise object and its data
        return $http.post('/api/admin/login', {
          'user': user
        }).success(function (data) {
          AuthToken.setToken(data.token)
          return data
        })
      }

      // log a user out by clearing the token
      authFactory.logout = function () {
        // clear the token
        AuthToken.setToken()
      }

      // check is user logged in
      // checks if there is a local token and validates it
      authFactory.isLoggedIn = function () {
        return !!AuthToken.getToken()
      }

      // get the logged in user
      authFactory.getUser = function () {
        if (AuthToken.getToken()) {
          return $http.get('/api/me', {cache: true})
        } else {
          return $q.reject({message: 'User has no token.'})
        }
      }

      // return auth factory object
      return authFactory
    }

    AdminAuthTokenService.$inject = ['$window']

    function AdminAuthTokenService ($window) {
      return {
        // get the token out of local storage
        getToken: function getToken () {
          return localStorage.getItem('access_token')
        },
        // set the token or clear the token
        // if a token is passed, set the token
        // if there is no token, clear it from local storage
        setToken: function setToken (token) {
          if (token) {
            $window.localStorage.setItem('access_token', token)
          } else {
            $window.localStorage.removeItem('access_token')
          }
        }
      }
    }

    AdminAuthInterceptService.$inject = ['$q', '$location', 'AuthToken']

    function AdminAuthInterceptService ($q, $location, AuthToken) {
      var interceptorFactory = {}

      // attach the token to every request
      interceptorFactory.request = function (config) {
        // grab the token
        var token = AuthToken.getToken()

        // if the token exists, add it to the header as x-access-token
        if (token) {
          config.headers['x-access-token'] = token
        }

        return config
      }

      // redirect if a token doesn't authenticate
      // happens on response errors
      interceptorFactory.responseError = function (response) {
        // if out server returns a 403 forbidden response
        if (response.status === 403) {
          AuthToken.setToken()
          $location.path('/login')
        }

        // return the errors from the server as a promise
        return $q.reject(response)
      }

      return interceptorFactory
    }

    /***/
  }),
  /* 24 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('AdminPageService', AdminPageService)

    AdminPageService.$inject = ['$http', 'Auth', '$location', '$q']

    function AdminPageService ($http) {
      // create a new object
      var pageFactory = {}

      // get a single page
      pageFactory.get = function (id) {
        return $http.get('/api/admin/pages/' + id)
      }

      // get all pages
      pageFactory.all = function () {
        return $http.get('/api/admin/pages/')
      }

      // create a page
      pageFactory.create = function (userData) {
        return $http.post('/api/admin/pages/', userData)
      }

      // update a page
      pageFactory.update = function (id, userData) {
        return $http.put('/api/admin/pages/' + id, userData)
      }

      // delete a page
      pageFactory.delete = function (id) {
        return $http.delete('/api/admin/pages/' + id)
      }

      // get a single post
      pageFactory.getSinglePost = function (pageId, postId) {
        return $http.get('/api/admin/pages/' + pageId + '/posts/' + postId)
      }

      // get all posts
      pageFactory.allPosts = function (pageId) {
        return $http.get('/api/admin/pages/' + pageId + '/posts/')
      }

      // create a post
      pageFactory.createPost = function (pageId, userData) {
        return $http.post('/api/admin/pages/' + pageId + '/posts/', userData)
      }

      // update a post
      // post of page updates via PostService update method

      // delete a post from page's posts array
      pageFactory.deletePostFromPage = function (pageId, postId) {
        return $http.delete('/api/admin/pages/' + pageId + '/posts/' + postId)
      }

      // return our entire pageFactory object
      return pageFactory
    }

    /***/
  }),
  /* 25 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('AdminPostService', AdminPostService)

    AdminPostService.$inject = ['$http', 'Auth', '$location', '$q']

    function AdminPostService ($http) {
      // create a new object
      var postFactory = {}

      // get a single post
      postFactory.get = function (id) {
        return $http.get('/api/admin/posts/' + id)
      }

      // get all posts
      postFactory.all = function () {
        return $http.get('/api/admin/posts/')
      }

      // create a post
      postFactory.create = function (userData) {
        return $http.post('/api/admin/posts/', userData)
      }

      // update a post
      postFactory.update = function (id, userData) {
        return $http.put('/api/admin/posts/' + id, userData)
      }

      // delete a post
      postFactory.delete = function (id) {
        return $http.delete('/api/admin/posts/' + id)
      }

      // return our entire postFactory object
      return postFactory
    }

    /***/
  }),
  /* 26 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('AdminUserService', AdminUserService)

    AdminUserService.$inject = ['$http', 'Auth', '$location', '$q']

    function AdminUserService ($http) {
      // create a new object
      var userFactory = {}

      userFactory.currentUser = {}

      // get a single user
      userFactory.get = function (id) {
        return $http.get('/api/admin/users/' + id)
      }

      // get all users
      userFactory.all = function () {
        return $http.get('/api/admin/users/')
      }

      // create a user
      userFactory.create = function (userData) {
        return $http.post('/api/admin/users/', userData)
      }

      // update a user
      userFactory.update = function (id, userData) {
        return $http.put('/api/admin/users/' + id, userData)
      }

      // delete a user
      userFactory.delete = function (id) {
        return $http.delete('/api/admin/users/' + id)
      }

      // get current user
      userFactory.current = function () {
        return $http.get('/api/admin/me')
      }

      // return our entire userFactory object
      return userFactory
    }

    /***/
  }),
  /* 27 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').factory('AdminSettingsService', AdminSettingsService)

    function AdminSettingsService () {
      var siteServiceFactory = {}

      siteServiceFactory.siteSettings = {}

      /**
       * Get site url from server
       */
      siteServiceFactory.siteSettings.url = 'localhost:8080/'

      /**
       * Get site title from server
       */
      siteServiceFactory.siteSettings.title = 'Perfect site'

      siteServiceFactory.getSiteTitle = function () {
        return siteServiceFactory.siteSettings.title
      }

      siteServiceFactory.getSiteUrl = function () {
        return siteServiceFactory.siteSettings.url
      }

      return siteServiceFactory
    }

    /***/
  }),
  /* 28 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    __webpack_require__(29)

    /***/
  }),
  /* 29 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('app').directive('filestyle', FilestyleDirective)

    function FilestyleDirective () {
      return {
        restrict: 'AC',
        scope: true,
        link: function link (scope, element, attrs) {
          var options = {
            'input': attrs.input !== 'false',
            'icon': attrs.icon !== 'false',
            'buttonBefore': attrs.buttonbefore === 'true',
            'disabled': attrs.disabled === 'true',
            'size': attrs.size,
            'buttonText': attrs.buttontext,
            'buttonName': attrs.buttonname,
            'iconName': attrs.iconname,
            'badge': attrs.badge !== 'false',
            'placeholder': attrs.placeholder
          }
          $(element).filestyle(options)
        }
      }
    }

    /***/
  }),
  /* 30 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    __webpack_require__(31)
    __webpack_require__(32)

    /***/
  }),
  /* 31 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('a.routes', ['ngRoute']).config(function ($routeProvider) {
      $routeProvider

      // admin login route
        .when('/admin/login', {
          templateUrl: 'app/views/admin/login.html',
          controller: 'aAuthCtrl',
          controllerAs: 'auth'
        })

        // admin registry route
        .when('/admin/signup', {
          templateUrl: 'app/views/admin/signup.html',
          controller: 'aAuthCtrl',
          controllerAs: 'auth'
        })

        // main admin dashboard route
        .when('/admin/dashboard', {
          templateUrl: 'app/views/admin/dashboard.html',
          controller: 'aDashboardCtrl',
          controllerAs: 'dashboard'
        }).otherwise({
        redirectTo: '/'
      })
    })

    /***/
  }),
  /* 32 */
  /***/ (function (module, exports, __webpack_require__) {

    'use strict'

    angular.module('routes', ['ngRoute']).config(function ($routeProvider, $locationProvider) {
      $routeProvider

      // forbidden page route
        .when('/forbidden', {
          templateUrl: 'app/views/public/forbidden.html'
        })

        /**
         * Routes for simple users
         */
        // home page route
        .when('/', {
          templateUrl: 'app/views/public/home.html'
        })

        // donation page route
        .when('/donation', {
          templateUrl: 'app/views/public/donation.html'
        })

        // login route
        .when('/login', {
          templateUrl: 'app/views/public/login.html'
        })

        // sign up route
        .when('/signup', {
          templateUrl: 'app/views/public/signup.html',
          controller: 'userCreateController',
          controllerAs: 'user'
        })

        // form to create a new user
        // same view as edit page
        .when('/users/create', {
          templateUrl: 'app/views/public/signup.html',
          controller: 'userCreateController',
          controllerAs: 'user'
        })

        // page to edit a user
        .when('/users/:user_id', {
          templateUrl: 'app/views/admin/users/single.html',
          controller: 'userEditController',
          controllerAs: 'user'
        })

      // set our app up to have pretty URLS
      $locationProvider.html5Mode(true)
    })

    /***/
  })
], [1]);
