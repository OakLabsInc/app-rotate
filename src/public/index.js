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
  $scope.touch_devices = []
  $scope.directions = [
    "NO_ROTATE",
    "LEFT",
    "RIGHT",
    "INVERTED"
  ]
  $scope.display = {
    "display_id": "",
    "configuration": {
        "enabled": true,
        "mode": "",
        "reflect": "NO_REFLECT",
        "rotate": "NO_ROTATE",
        "transform": ""
    }
  } 
  $scope.touch = {
    "touch_device_id": "",
    "configuration": {
        "calibration": "",
        "OBSOLETE_swap_axes": false,
        "rotate": "NO_ROTATE"
    }
  }
  $scope.getAvailableDisplays = function () {
    $http({
      method: 'GET',
      url: '/display/available'
    }).then(function successCallback (response) {
      $log.info("getAvailableDisplays",response)
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
      $log.info( "getAvailableTouch", response)
      if(response.data.touch_devices.length){
        $scope.touch_devices = response.data.touch_devices
        $scope.touch.touch_device_id = $scope.touch_devices[0].touch_device_id
      }
    }, function errorCallback (response) {
      $log.info(response)
    })
  }

  $scope.rotateScreenAndTouch = function(display){
    $scope.touch.configuration.rotate = display.configuration.rotate

    let req = {
      'display': {
        "display_id": $scope.display.display_id,
        "configuration": $scope.display.configuration
      },
      'touch': {
        "touch_device_id": $scope.touch.touch_device_id,
        "configuration" : {
          "rotate": $scope.display.configuration.rotate
        }
      }
    }
    $log.info(req)
    $http({
      method: 'GET',
      url: '/display/rotate?req=' + JSON.stringify(req)
    }).then(function successCallback (response) {
      $log.info( "rotateScreenAndTouch", response)
    }, function errorCallback (response) {
      $log.info(response)
    })
  }
  


  $scope.getAvailableDisplays()
  $scope.getAvailableTouch()
  oak.ready()
})
