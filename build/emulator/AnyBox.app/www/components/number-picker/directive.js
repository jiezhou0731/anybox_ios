angular.module('numberPicker', [])
  .directive('numberPicker', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/number-picker/layout.html',
      scope: {
        value: '=',
        storage:'='
      },
      link: function link(scope, element, attrs) {
        scope.increase = function () {
          if (scope.value < scope.storage) {
            scope.value += 1;
          }
        };
        scope.decrease = function () {
          if (scope.value > 0) {
            scope.value -= 1;
          }
        };
      }
    };
  });
