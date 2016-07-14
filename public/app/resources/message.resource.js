app.factory('messageResource', function ($resource) {
	return $resource('messages/:id', {id: '@id'});
})