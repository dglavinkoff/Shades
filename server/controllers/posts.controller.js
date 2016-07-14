var Post = require('mongoose').model('Post');
var cloudinary = require('cloudinary');
var q = require('q');
var gm = require('gm').subClass({imageMagick: true});

//Config cloudinary account
cloudinary.config({
        cloud_name: 'dlookuqja',
        api_key: '647976278158689',
        api_secret: 'U58WbohGLCiO8ACc6f8SWxRP_lg'
    })

//Extracts the tags from status text and returns them as an array
function extractTags (text) {

	var keepSearching = true;
            var index = 0;
            var tags = []

                //Searching for peopleTags
                while (keepSearching) {
                    if (text.indexOf('@', index) > -1) {
                        var currentIndex = text.indexOf('@', index);
                        var EndIndex = text.length;
                        var indexOfWhitespace = text.indexOf(' ', currentIndex);
                        if(indexOfWhitespace > -1) EndIndex = indexOfWhitespace;
                        var tagText = text.slice(currentIndex + 1, EndIndex);
                        tags.push({text: tagText, startIndex: currentIndex, endIndex: EndIndex, type: 'person'});
                        index = EndIndex;
                    }
                    else {
                        keepSearching = false;
                    }
                }

                //Reinitializing search
                index = 0;
                keepSearching = true;

                //Searching for hashtags
                while (keepSearching) {
                    if (text.indexOf('#', index) > -1) {
                        var Index = text.indexOf('#', index);
                        var NextWhiteSpace = text.indexOf(' ', Index);
                        var endIndex = text.length;
                        if (NextWhiteSpace > -1) endIndex = NextWhiteSpace;
                        var tag = text.slice(Index + 1, endIndex);
                        tags.push({text: tag, startIndex: Index, endIndex: endIndex, type: 'hashtag'});
                        index = endIndex;
                    }
                    else {
                        keepSearching = false;
                    }
                }

            return tags;
}

//Returns the size of an image
function imageSize (buffer) {
	var deferred = q.defer();

	gm(buffer)
	.size(function (err, size) {
		if(err){
			console.log(err);
			deferred.reject('Error getting size');
		}
		else{
			deferred.resolve(size);
		}
	})

	return deferred.promise;
}

//Uploads file to clodinary account and returns the result
function uploadFileToCloudinary (buffer) {
	var deferred = q.defer();

	imageSize(buffer).then(function successfullyObtained (size) {
		cloudinary.uploader.upload(buffer, function (result) {
			if(!!result){
				deferred.resolve(result);
			} 
			else deferred.reject('Error uploading image to cloudinary');
		}, {width: size.width > 400 ? 400 : size.width, height: size.height > 500 ? 500 : size.height})
	},function (reason) { deferred.reject(reason)});

	return deferred.promise;
};

function uploadVideoToCloudinary (buffer) {
	var deferred = q.defer();

		cloudinary.uploader.upload(buffer, function (result) {
			if(!!result){
				deferred.resolve(result);
			} 
			else deferred.reject('Error uploading video to cloudinary');
		}, {resource_type: 'video', width: 400, height: 500})

	return deferred.promise;
};

module.exports = {

	create: function (req, res) {
		
		req.body.author = req.user.username;
		req.body.tags = extractTags(req.body.text);

		if(!!req.files && !!req.files.image) {
			uploadFileToCloudinary(req.files.image.path).then(function successfullyUploaded (result) {
				//The result.url property contains the url of the image in cloudinary
				req.body.image = result.url;

				Post.create(req.body, function (err, post) {
					if(err) res.status(400).send(false);
					else{
						res.send(post);
					}
				})

			}, function (reason) {res.status(400).send(false)});
		}
		if(!!req.files && !!req.files.video) {
			uploadVideoToCloudinary(req.files.video.path).then(function successfullyUploaded (result) {
				//The result.url property contains the url of the video in cloudinary
				req.body.video = result.url;

				Post.create(req.body, function (err, post) {
					if(err) res.status(400).send(false);
					else{
						res.send(post);
					}
				})

			}, function (reason) {res.status(400).send(false)});
		}
		else {
			Post.create(req.body, function (err, status) {
				if(err) res.status(400).send(false);
				else{
					res.send(status);
				} 
			})
		}
	},

	delete: function (req, res) {
		if(req.user.username == req.interactionPost.author) {
			Post.findByIdAndRemove(req.interactionPost._id, function (err, post) {
				if(!!err) {
					res.status(400).send(false);
				}
				else res.send(post);
			})
		}
		else {
			res.status(403).send('Not authorized');
		}
	},

	loadPosts: function (shades, loggedUser, toSkip) {

		var deferred = q.defer();

		if(loggedUser.shades.length > 0){
			if(loggedUser.shades.map(function(shades){return shades._id}).indexOf(shades._id) == -1) deferred.reject('You do not have permissions');
			else {

				//Determine the type and people filters
				var typeArray =  shades.filterByType.length > 0 ? shades.filterByType : ['text', 'image', 'video'];
            	var peopleArray = shades.filterByPeople.length > 0 ? shades.filterByPeople: loggedUser.following;


            	Post.find({})
                	.where('type').in(typeArray)
                	.where('author').in(peopleArray)
                	.sort('-date')
                	.skip(toSkip)
                	.limit(10)
                	.populate('comments')
                	.exec(function(err, posts){
                    	if(err){
                        	deferred.reject();
                    	}
                    	console.log(posts);
                    	deferred.resolve(posts);
               		});
			}
		}
		else deferred.reject('You do not have permissions');

		return deferred.promise;
	},

	//Populates the request object with the interacted post
	interactionPost : function (req, res, next) {
		Post.findById(req.params.id).exec(function (err, post) {
			if (!!err) {
				res.status(400);
				res.send(err);
			}
			else {
				req.interactionPost = post;
				next();
			}
		})
	}
}