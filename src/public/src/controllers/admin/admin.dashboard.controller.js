angular.module('app').controller('AdDashboardCtrl', AdDashboardCtrl)

AdDashboardCtrl.$inject = [
  '$rootScope',
  'Auth',
  '$location',
  'aUser',
  'siteService'
]

function AdDashboardCtrl ($rootScope, Auth, $location, aUser, siteService) {
  const vm = this

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
  vm.doLogout = () => {
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
  }

  // get data of current user
  aUser.current().success((data) => {
    vm.userData = data
  })

  vm.toSiteHome = () => {
    $rootScope.$emit('show-nav-menu')
    $location.path('/')
  }

  vm.toDashboard = () => {
    $rootScope.$emit('hide-nav-menu')
    $location.path('/admin/dashboard')
  }

  // methods toggles styles of dashboard menu items
  vm.toggleActiveClass = (element) => {
    angular.element('.dshd-menu-child-item a')
      .css('color', '#fff')

    angular.element(element)
      .css('color', '#ff904e')
  }

  /**
   * Dashboard menu selectors methods
   */

  // Home menu section

  // go to home screen
  vm.toHome = () => {
    vm.toggleActiveClass('.btn-home')

    vm.contentUrl = 'app/views/admin/home.html'

    localStorage.setItem('dashboard-content', vm.contentUrl)
  }

  // Pages menu section

  // show all pages
  vm.allPages = () => {
    vm.toggleActiveClass('.btn-all-pages')

    vm.contentUrl = 'app/views/admin/page/all.html'

    localStorage.setItem('dashboard-content', vm.contentUrl)
  }

  // create new page
  vm.createPage = ($event) => {
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
  vm.allPosts = () => {
    vm.toggleActiveClass('.btn-all-posts')

    vm.contentUrl = 'app/views/admin/post/all.html'

    localStorage.setItem('dashboard-content', vm.contentUrl)
  }

  // create new post
  vm.createPost = ($event) => {
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
  vm.allUsers = () => {
    vm.contentUrl = 'app/views/admin/user/all.html'

    localStorage.setItem('dashboard-content', vm.contentUrl)

    aUser.all()
      .success((data) => {
        // bind the users that come back to vm.users
        vm.users = data

        // set a processing variable to show loading things
        vm.processing = true

        for (let i = 0; i < vm.users.length; ++i) {
          if (vm.users[i].site === undefined) {
            continue
          }
          if (vm.users[i].site.length > 40) {
            vm.users[i].siteAlias =
              vm.users[i].site.substring(0, 40) + '...'
          } else {
            vm.users[i].siteAlias = vm.users[i].site
          }
        }
      })
  }

  vm.createNewUser = () => {
    vm.contentUrl = 'app/views/admin/user/single.html'

    localStorage.setItem('dashboard-content', vm.contentUrl)
    localStorage.setItem('user-edit-type', 'create')
  }

  vm.editUser = (id) => {
    vm.contentUrl = 'app/views/admin/user/single.html'

    localStorage.setItem('user-id-to-edit', id)
    localStorage.setItem('dashboard-content', vm.contentUrl)
    localStorage.setItem('user-edit-type', 'edit')
  }

  // PAGE EVENTS
  $rootScope.$on('changeDashboardContent', () => {
    vm.contentUrl = localStorage.getItem('dashboard-content')
  })
}
