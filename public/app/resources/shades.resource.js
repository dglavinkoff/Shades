app.factory('shadesResource', function ($resource) {
	return $resource('/shades/:id', {id: '@id'});
})