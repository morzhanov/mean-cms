angular.module('app').controller('AdPostCtrl', AdPostCtrl)
angular.module('app').controller('AdPostEditCtrl', AdPostEditCtrl)

AdPostCtrl.$inject = ['aPostCtrl', '$rootScope', '$window', 'aPost']

function AdPostCtrl ($rootScope, $window, aPost) {
  const vm = this

  vm.processing = true

  // get all posts
  vm.getAllPosts = () => {
    aPost.all()
      .success(function (data) {
        vm.posts = data

        for (let i = 0; i < vm.posts.length; ++i) {
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

    $window.localStorage.setItem('dashboard-content',
      'app/views/admin/post/single.html')

    $window.localStorage.setItem('single-post-edit-type', 'edit')

    $rootScope.$emit('changeDashboardContent')
  }

  vm.deletePost = function (id) {
    aPost.delete(id)
      .success(() => {
        alert('post successfully deleted!')

        vm.getAllPosts()
      })
  }
}

AdPostEditCtrl.$inject = ['$rootScope', '$window', 'aPost']

function AdPostEditCtrl ($rootScope, $window, aPost) {
  // also for post creating
  const vm = this

  vm.message = ''

  vm.postId = $window.localStorage.getItem('edit-post-id')

  vm.type = $window.localStorage.getItem('single-post-edit-type')

  vm.postData = {}

  $rootScope.$on('toggleEditPostView', () => {
    vm.postData = {}
    vm.type = 'create'
  })

  // if it's edit type get post from server and fill fields
  if (vm.type === 'edit') {
    aPost.get(vm.postId)
      .success(function (data) {
        vm.postData.title = data.title
        vm.postData.content = data.content
        vm.postData.date = data.date
      })
  }

  vm.savePost = () => {
    if (vm.type === 'edit') {
      aPost.update(vm.postId, vm.postData)
        .success(() => {
          vm.message = 'Post successfully edited!'
        })
    } else {
      aPost.create(vm.postData)
        .success(() => {
          vm.message = 'Post successfully created!'
        })
    }
  }
}
