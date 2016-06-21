(function() {
'use strict';

var underscore = angular.module('underscore', []);
underscore.factory('_', function () { return window._; });

var validator = angular.module('validator', []);
underscore.factory('validator', function () { return window.validator; });

angular.module('app', [
  'underscore',
  'ui.bootstrap',
  'ui.router',
  'ngResource',
  'smart-table',
  'toastr',
  'app.directives',
  'app.services',
  'app.controllers'])

  .config(['$urlRouterProvider', '$stateProvider', 'toastrConfig', 
    function ($urlRouterProvider, $stateProvider, toastrConfig) {

      // configure toastr defaults
      angular.extend(toastrConfig, {
        timeOut: 2000
      });

      // setup routing
      
      // note: i tried angular-new-router, but i was getting double controller 
      // initialization so im using ui-router instead

      $urlRouterProvider.otherwise('/home'); // default route

      $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'html/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'html/about.html',
        controller: 'AboutController',
        controllerAs: 'about'
      })
      .state('submit', {
        url: '/submit',
        templateUrl: 'html/submit.html',
        controller: 'SubmitController',
        controllerAs: 'submit'
      })
      .state('catalog', {
        url: '/catalog',
        templateUrl: 'html/catalog.html',
        controller: 'CatalogController',
        controllerAs: 'catalog'
      })
      .state('stats', {
        url: '/stats/:id',
        templateUrl: 'html/stats.html',
        controller: 'StatsController',
        controllerAs: 'stats'
      });
      
    }]);

})();

