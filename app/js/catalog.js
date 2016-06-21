(function() {
'use strict';

angular.module('app.controllers')
.controller('CatalogController', ['Link',
  function(Link) {

    this.linkCollection = Link.query();
    this.displayCollection = [];
    
  }]);

})();