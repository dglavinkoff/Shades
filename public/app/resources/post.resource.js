app.factory('postResource', function ($resource) {
	return $resource('/post/:id', {id: '@id'});
})