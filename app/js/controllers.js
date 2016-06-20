(function() {
'use strict';

angular.module('app.controllers', [])

.controller('AppController', ['$location',
    function ($location) {
        var vm = this;

        vm.options = [
            { key: 'home', display: 'Home'},
            { key: 'about', display: 'About' },
            { key: 'submit', display: 'Submit' },
            { key: 'catalog', display: 'Catalog' },
            { key: 'stats', display: 'Statistics' }
        ];

        vm.isActive = function(location) {
            return (location === $location.path().split('/')[1]);
        };
    }]);

})();

