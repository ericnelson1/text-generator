(function() {
'use strict';

angular.module('app', [
    'ui.bootstrap',
    'ngNewRouter',
    'ngResource',
    'app.directives',
    'app.services',
    'app.controllers'])

.constant('validator', window.validator);

})();

