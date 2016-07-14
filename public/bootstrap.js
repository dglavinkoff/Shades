angular.element(document).ready(function () {

	//Bootstrap the document and get identity
	var $injector = angular.bootstrap(document, ['Shades']);
	//var rootScope = $injector.get('$rootScope');
	var Authentication = $injector.get('Authentication');
	var shadesService = $injector.get('shadesService')
	var newsFeedSocket = $injector.get('newsFeedSocket')
	var chatSocket = $injector.get('chatSocket');

	if(Authentication.isAuthenticated()){
		if(Authentication.currentUser.shades.length > 0){
			shadesService.currentShades = Authentication.currentUser.shades[0];
		}
		newsFeedSocket.authenticate(Authentication.currentUser.username);
		chatSocket.authenticate(Authentication.currentUser.username);
	}
})