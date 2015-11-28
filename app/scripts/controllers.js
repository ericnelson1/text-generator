(function() {
'use strict';

angular.module('app.controllers', [])

.controller('AppController', ['$router', '$location',
    function ($router, $location) {

        $router.config([
             { path: '/', redirectTo: '/home' },
             { path: '/home', component: 'home' },
             { path: '/about', component: 'about' },
             { path: '/submit', component: 'submit' },
             { path: '/links', component: 'links' },
             { path: '/stats', component: 'stats' }
           ]);

        this.options = [
            { key: 'home', display: 'Home'},
            { key: 'about', display: 'About' },
            { key: 'submit', display: 'Submit' },
            { key: 'links', display: 'Links' },
            { key: 'stats', display: 'Statistics' }
        ];

        this.isActive = function(location) {
            return ('/' + location === $location.path());
        };
    }]);

})();

