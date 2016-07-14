app.factory('Authentication', ['userResource', '$window', function(userResource, $window){
    var user;

    if(!!$window.customUserObject){
        user = new userResource();
        angular.extend(user, $window.customUserObject);
    }

    return {
        currentUser: user,
        isAuthenticated: function(){
            return !!this.currentUser
        }
    }

}]);