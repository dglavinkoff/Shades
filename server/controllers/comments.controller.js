var Comment = require('mongoose').model('Comment');
var Post = require('mongoose').model('Post');

module.exports = {
	create: function (req, res) {
		//Checking for author existance
		req.body.author = req.user.username;

		Comment.create(req.body).then(function successfullyCreated (comment) {

			//Adding comment to status and saving
			Post.findById(req.body.post).exec(function (err, post) {
				if(!err && !!post) {
					post.addComment(comment._id, function (success) {
						if(success) {
							res.send(comment);
						}
						else {
							res.status(400);
							res.send(false);
						}
					})
				}
				else {
					res.status(400);
					res.send('Post does not exist.');
				}
			})							
		})
	},
	delete: function (req, res) {
		Comment.findByIdAndRemove(req.interactionComment._id).exec(function (err, comment){
			if(err){
				res.status(400);
				res.send(err);
			}
			else {
				Post.findById(comment.post).exec(function (err, post) {
					if(!err) {
						post.removeComment(comment._id, function (success) {
							if(success) {
								res.send(comment);
							}
							else {
								res.status(400);
								res.send(false);
							}
						})
					}
					else {
						res.status(400);
						res.send('Post does not exist.');
					}
				})				
			} 
		})					
	},
	interactionComment: function (req, res, next) {
		Comment.findById(req.params.id).exec(function (err, comment) {
			if (!!err) {
				res.status(400);
				res.send(err);
			}
			else {
				req.interactionComment = comment;
				next();
			}
		})
	},
	hasAuthorization: function (req, res, next) {
		if(req.user.username == req.interactionComment.author) {
			next();
		}
		else {
			res.status(403);
			res.send('Not authorized');
		}
	}
}