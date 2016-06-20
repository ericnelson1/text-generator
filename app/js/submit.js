(function() {
'use strict';

angular.module('app.controllers')
.controller('SubmitController', ['validator', 'Link',
  function(validator, Link) {

  	this.submit = function() {
  		if (validator.isURL(this.url)) {
        var entry = new Link();
        entry.data = {url: this.url};
        var self = this;
        Link.save(entry, function(){
          self.url = '';
          self.message = 'Thank you for your submission'; 
        });
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