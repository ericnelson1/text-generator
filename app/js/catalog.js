(function() {
'use strict';

angular.module('app.controllers')
.controller('CatalogController', ['Link',
  function(Link) {
    var vm = this;
    vm.linkCollection = Link.query();
    vm.displayCollection = [];
    
  }]);

})();