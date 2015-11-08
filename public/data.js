(function () {

	'use strict';

	angular.module('app.services', []);

	[
		'linkService',
		'sequenceService'
	].forEach(function (serviceName) {
		angular.module('app.services').service(serviceName,
			['$resource', '$log', '$window', '$q', '$timeout',
			function ($resource, $log, $window, $q, $timeout) {
				var self = this;

				// setup window unload handler to write data to session storage in case of refresh
				angular.element($window).bind("beforeunload", function () {
					if (self.data) {
						$window.sessionStorage[serviceName] = angular.toJson(self.data);
					}
					// todo: also store state object, inprogress always false
				});

				// after refresh, reinitialize data
				if ($window.sessionStorage[serviceName]) {
					self.data = angular.fromJson($window.sessionStorage[serviceName]);
					// todo: reload state
				}

				self.inprogress = false;
				self.error = false;
				self.errormessage = '';

				var _get = function (url, update, method) {

					if (!url) {
						$log.error('Service:' + serviceName + ' Error: Url cannot be empty');
						$q.reject();
					}

					var timeout = $q.defer();

					var timer = $timeout(function () {
						timeout.resolve();
						self.inprogress = false;
						self.error = true;
						self.errormessage = 'Timeout occurred'
					}, 60000);

					var resource = $resource(url, {
					}, {
						get: {
							method: 'GET',
							timeout: timeout.promise
						}
					});

					self.inprogress = true;
					self.error = false;

					var p = resource[method](
							function (data) {
								if (!update) {
									self.data = data;
								}
								self.inprogress = false;
								$timeout.cancel(timer);
							},
							function (error) {
								self.inprogress = false;
								self.error = true;
								$log.error('dataservice get error: ' + url + ' ' + error);
								$timeout.cancel(timer);
								// todo: display error, maybe thru another service
							}).$promise;
					return p;
				};

				self.load = function (url, update) {
					return _get(url, update, 'query');
				};

				self.get = function (url, update) {
					return _get(url, update, 'get');
				};

				self.add = function (url, item) {
					var Entry = $resource(url);
					var entry = new Entry();
					angular.extend(entry, item);

					self.inprogress = true;

					var p = entry.$save(
						function (data, responseHeaders) {
							if (self.data &&
                                self.data.items &&
                                ((angular.element.grep(self.data.items, function (d) { return d.selfUrl === data.selfUrl; })).length === 0)) {
								self.data.items.push(data);
							}
							if (data.selfUrl) {
								data.selfUrl = responseHeaders('Location');
							}
							self.inprogress = false;
						},
						function (httpResponse) {
							self.error = true;
							self.inprogress = false;
							$log.error('dataservice add error: ' + self.url + ' ' + httpResponse);
						});

					return p;
				};


				self.delete = function (item) {

					self.inprogress = true;

					item.$delete({ id: item.id },
						function () {
							self.data.splice(self.data.indexOf(item), 1);
							self.inprogress = false;
						},
						function (error) {
							self.error = true;
							self.inprogress = false;
							$log.error('dataservice delete error: ' + self.url + ' ' + error);
						});
				};
			}])
	});
})();