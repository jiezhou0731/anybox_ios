angular.module('fieldEditor', [])
  .directive('fieldEditor', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/field-editor/layout.html',
      scope: {
        filedValue: '=',
        isEditing: '=',
        label: '@label',
        clickSubmit: '&'
      },
      link: function link($scope, element, attrs) {
    	  console.log($scope.isEditing+" "+$scope.filedValue);
      }
    };
  });
