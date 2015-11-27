(function() {
'use strict';

angular.module('app.controllers')
.controller('SubmitController', ['validator', 'Link',
  function(validator, Link) {

    this.links = Link.query();

  	this.submit = function() {
  		if (validator.isURL(this.url)) {
  			this.message = 'Thank you for your submission';	
  		}	
  		else {
  			this.message = "That ain't a valid url, man";
  		}
  	};

  	this.change = function () {
  		this.message = '';
  	};

  }]);

})();