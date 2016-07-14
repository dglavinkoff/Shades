app.factory('userResource', ['$resource', function ($resource) {
	return $resource('/user/:username', {username: '@username', id: '@_id'}, {
		signin: {method: 'POST', url: '/user/signin'},
		signout: {method: 'GET', url: '/user/signout'},
		signup: {method: 'POST', url: '/user'},
		update: {method: 'PUT', url: '/user', isArray: false},
		follow: {method: 'GET', url: '/user/follow/:username'},
		unfollow: {method: 'GET', url: '/user/unfollow/:username'},
		block: {method: 'GET', url: '/user/block/:username'},
		unblock: {method: 'GET', url: '/user/unblock/:username'},
		search: {method: 'GET', url:'/user/search/:query', isArray: true}
	}) 
}])