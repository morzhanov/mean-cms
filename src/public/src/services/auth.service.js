angular.module('app').factory('AuthService', AuthService)
angular.module('app').factory('AuthTokenService', AuthTokenService)
angular.module('app').factory('AuthInterceptorService', AuthInterceptorService)

AuthService.$inject = ['$http', '$q', 'AuthToken']

function AuthService ($http, $q, AuthToken) {
  // create auth factory object
  const authFactory = {}

  // log a user in
  authFactory.login = function (user) {
    // return the promise object and its data
    return $http.post('/api/admin/login',
      {
        'user': user
      })
      .success(function (data) {
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
    getToken: function () {
      return localStorage.getItem('access_token')
    },
    // set the token or clear the token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage
    setToken: function (token) {
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
  let interceptorFactory = {}

  // attach the token to every request
  interceptorFactory.request = function (config) {
    // grab the token
    const token = AuthToken.getToken()

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
