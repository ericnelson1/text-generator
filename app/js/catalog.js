(function() {
'use strict';

angular.module('app.controllers')
.controller('LinksController', ['validator', 'Link',
  function(validator, Link) {

    this.linkCollection = Link.query();
    this.displayCollection = [];
    
  }]);

})();