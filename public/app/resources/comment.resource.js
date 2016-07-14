app.factory('commentResource', function ($resource) {
	return $resource('/comment/:id', {id: '@id'});
})