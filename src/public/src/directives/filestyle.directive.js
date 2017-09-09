angular.module('app')
  .directive('filestyle', FilestyleDirective)

function FilestyleDirective () {
  return {
    restrict: 'AC',
    scope: true,
    link: (scope, element, attrs) => {
      const options = {
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
