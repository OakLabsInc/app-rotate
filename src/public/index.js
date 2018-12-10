window.oak.disableZoom()

window.reload = function () {
  window.oak.reload()
}

window.app = window.angular
  .module('rotateApp', [
    'ngAnimate',
    'ngMessages',
    'ngMaterial'
  ])
  .constant('os', window.os)
  .constant('oak', window.oak)
  .constant('_', window.lodash)
  .run(function ($rootScope) {
    $rootScope._ = window.lodash
  })
  .config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self'])
  })

window.app.controller('appController', function ($log, $timeout, $scope, $http, $window, oak, _) {
  // ripples
  $scope.untapped = true
  $scope.cursor = {
    x: 0, y: 0
  }
  $scope.showCursor = false
  $scope.cursorTimeout = 10000
  var cursorPromises = []
  var timer

  // main window touches. this will log all tapped items, and also add the UI ripple of the tapped area
  $scope.ripples = []

  $scope.mouseMoved = function ({ pageX: x, pageY: y }) {
    // dont show cursor if the settings has `false` or 0 as the cursorTimeout
    if ($scope.cursorTimeout) {
      resetCursorTimer()
      $scope.cursor = { x, y }
    }
  }
  var clearCursorPromises = function () {
    cursorPromises.forEach(function (timeout) {
      $timeout.cancel(timeout)
    })
    cursorPromises = []
  }
  var resetCursorTimer = function () {
    clearCursorPromises()
    $scope.showCursor = true
    timer = $timeout(function () {
      $scope.showCursor = false
    }, $scope.cursorTimeout)
    cursorPromises.push(timer)
  }

  $scope.$on('$destroy', function () {
    clearCursorPromises()
  })

  $scope.tapped = function ({ pageX, pageY }) {
    let id = $window.uuid.v4()
    $scope.showCursor = false
    $scope.ripples.push({
      x: pageX, y: pageY, id
    })
    $timeout(function () {
      _.remove($scope.ripples, { id })
    }, 500)

    if ($scope.untapped) {
      $scope.untapped = false
    }
  }
  $scope.touchDevices = []
  $scope.directions = [
    'NO_ROTATE',
    'LEFT',
    'RIGHT',
    'INVERTED'
  ]
  $scope.display = {
    'displayId': '',
    'configuration': {
      'enabled': true,
      'mode': '',
      'reflect': 'NO_REFLECT',
      'rotate': 'NO_ROTATE',
      'transform': ''
    }
  }
  $scope.touch = {
    'touchDeviceId': '',
    'configuration': {
      'calibration': '',
      'orientation': 'UPRIGHT'
    }
  }
  $scope.getAvailableDisplays = function () {
    $http({
      method: 'GET',
      url: '/display/available'
    }).then(function successCallback (response) {
      $log.info('getAvailableDisplays', response)
      $scope.displays = response.data.displays
    }, function errorCallback (response) {
      $log.info(response)
    })
  }
  $scope.getAvailableTouch = function () {
    $http({
      method: 'GET',
      url: '/touch/available'
    }).then(function successCallback (response) {
      $log.info('getAvailableTouch', response)
      if (response.data.touchDevices.length) {
        $scope.touchDevices = response.data.touchDevices
        $scope.touch.touchDeviceId = $scope.touchDevices[0].touchDeviceId
      }
    }, function errorCallback (response) {
      $log.info(response)
    })
  }

  $scope.rotateScreenAndTouch = function (display, isForward) {
    // $scope.touch.configuration.rotate = display.configuration.rotate
    let prefix = "FORWARD_"
    
    if( !isForward ) {
      prefix = "BACKWARD_"
    }

    let orientation = $scope.display.configuration.rotate
    if ($scope.display.configuration.rotate === "NO_ROTATE") {
      orientation = "UPRIGHT"
    }
    let req = {
      'display': {
        'displayId': $scope.display.displayId,
        'configuration': $scope.display.configuration
      },
      'touch': {
        'touchDeviceId': $scope.touch.touchDeviceId,
        'configuration': {
          'calibration' : '',
          'orientation': prefix + orientation
        }
      }
    }
    $log.info('req', req.display)
    $http({
      method: 'GET',
      url: '/rotate/display?display=' + JSON.stringify(req.display)
    }).then(function successCallback (response) {
      $log.info('/rotate/display', response)
    }, function errorCallback (response) {
      $log.info(response)
    })

    $http({
      method: 'GET',
      url: '/rotate/touch?touch=' + JSON.stringify(req.touch)
    }).then(function successCallback (response) {
      $log.info('/rotate/touch', response)
    }, function errorCallback (response) {
      $log.info(response)
    })
  }
  $scope.automaticSave = function (display) {
    $http({
      method: 'GET',
      url: '/automatic/generate'
    }).then(function successCallback (response) {
      $log.info('automaticSave::', response)
    }, function errorCallback (response) {
      $log.info(response)
    })
  }

  $scope.getAvailableDisplays()
  $scope.getAvailableTouch()
  oak.ready()
})
