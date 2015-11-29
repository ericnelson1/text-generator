(function() {
'use strict';

angular.module('app.controllers')
.controller('LinksController', ['validator', 'Link',
  function(validator, Link) {

    this.links = Link.query();
    
    // // split data into 4 columns
    // var linksPerCol = data.length / 4;
    // $scope.lists = [
    //     data.splice(0, linksPerCol),
    //     data.splice(0, linksPerCol),
    //     data.splice(0, linksPerCol),
    //     data
    // ];

  }]);

})();