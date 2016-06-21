(function() {
'use strict';

angular.module('app.controllers')
.controller('SubmitController', ['validator', 'Link',
  function(validator, Link) {
    var vm = this;

  	vm.submit = function() {

  		if (!validator.isURL(this.url)) 
        vm.message = "That ain't a valid url, man";

      var entry = new Link();
      entry.data = {url: vm.url};
      Link.save(entry, function(){
        vm.url = '';
        vm.message = 'Thank you kindly for your submission'; 
      });
  	};

  	vm.change = function () { vm.message = ''; };

  }]);

})();