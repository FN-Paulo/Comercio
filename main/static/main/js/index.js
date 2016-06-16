//full app
var app = angular.module('clock', ['ngClock']);

// ngClock module
// ================================================
angular.module('ngClock', [])

// filters
// ================================================
.filter('pad', function() {
  return function(num) {
    return (num < 10 ? '0' + num : num); // coloca o zero na frente
  };
})
// directives
// ================================================
.directive('ngClock', ["$timeout", function($timeout){
  return {
    restrict: 'E',
    template:'<h1 class="time">'
        + '<span class="hours">'
        + ' {{date.getHours() | pad}}'
        + '</span>:<span class="minutes">'
        + ' {{date.getMinutes() | pad}}'
        + '</span>:<span class="seconds">'
        + ' {{date.getSeconds() | pad}}'
        + '</span>'
        + '</h1>',
    controller: function($scope, $element) {
      $scope.date = new Date();
      
      var tick = function() {
        $scope.date = new Date();
        $timeout(tick, 1000);
      };
      $timeout(tick, 1000);
    }
  }
  
}]);