app.controller('messageController', function ($scope, Authentication, messageService, chatSocket, messageResource) {
	
	$scope.Authentication = Authentication;
	$scope.personalChatEnabled = false;
	$scope.currentChatWith = undefined;
	$scope.messages = [];

	$scope.$on('socket:message', function (ev, message) {
		// Pushing the message to the array holding the conversation with the given user
		if(message.receiver == Authentication.currentUser.username){
			if(!messageService.messages[message.sender]) messageService.messages[message.sender] = [];
			messageService.messages[message.sender].push(message);
		} 
		else{
			if(!messageService.messages[message.receiver]) messageService.messages[message.receiver] = [];
			messageService.messages[message.receiver].push(message);
		} 
	});

	$scope.$on('socket:messages', function (ev, messages) {
		if(messages.length > 0){
			messages.reverse();
			// Initializing an array to hold the conversation with the given user
			if(!messageService.messages[messages[0].receiver] && messages[0].receiver != Authentication.currentUser.username) messageService.messages[messages[0].receiver] = [];
			else if(!messageService.messages[messages[0].sender]) messageService.messages[messages[0].sender] = [];

			// Pushing the messages to the array holding the conversation with the given user
			if(messages[0].receiver == Authentication.currentUser.username){
				messageService.messages[messages[0].sender].unshift.apply(messageService.messages[messages[0].sender], messages);
			}
			else{
				messageService.messages[messages[0].receiver].unshift.apply(messageService.messages[messages[0].receiver], messages);
			} 
		}
		
        $scope.messages = messageService.messages[$scope.currentChatWith];
	})

	$scope.$on('socket:deleted message', function (message) {

		var messagesWithReceiver = messageService.messages[message.receiver];

		if(messagesWithReceiver.length > 0){
			var indexOfMessage = messagesWithReceiver.map(function(message){return message._id}).indexOf(message._id);
			messagesWithReceiver.splice(indexOfMessage, 1);
		}
	})

	$scope.$on('socket:error loading chat', function (reason) {
		console.log(reason);
	})

	$scope.sendMessage = function (textContent) {
		var message = new messageResource({text: textContent, sender: Authentication.currentUser.username, receiver: $scope.currentChatWith});
		message.$save().then(function(message) {
			messageService.messages[message.receiver].push(message)
		}, function(reason) {console.log(reason)});
	}

	$scope.deleteMessage = function (id) {
		var messageToDelete = new messageResource({id: id});

		messageToDelete.$delete().then(console.log(message), console.log(reason));
	}

	$scope.loadMoreMessages = function(username){
		$scope.personalChatEnabled = true;
        $scope.currentChatWith = username;
        console.log($scope.personalChatEnabled);
        var toSkip = messageService.messages[$scope.currentChatWith] != undefined ? messageService.messages[$scope.currentChatWith].length : 0;
		var usernames = [username, Authentication.currentUser.username];

		chatSocket.loadMessages(usernames, toSkip); 
        
    };

    $scope.determineStyle = function(author){
      if(author == Authentication.currentUser.username){
          return {
              'float': 'right',
              'background-color': '#008cba',
              'color': '#fff',
              'border-radius': '5px'
          }
      }
      else{
        return {
            'float': 'left',
            'background-color': '#eee'
        }
      };
  	};

  	$scope.back = function () {
  		$scope.personalChatEnabled = false;
  	}

})