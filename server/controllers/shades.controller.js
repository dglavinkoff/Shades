var Shades = require('mongoose').model('Shades');

module.exports = {
	create: function (req, res) {

		req.body.author = req.user._id;
		Shades.create(req.body, function (err, shades) {
			if(!!err) res.status(400).send(false);
			else {
				req.user.addShades(shades._id, function (success) {
					if(success) {
						res.send(shades);
					}
					else res.status(400).send(false);
				})
			}
		});
	},
	delete: function (req, res) {
		Shades.findByIdAndRemove(req.interactionShades._id, function (err, shades) {
			if(!!err) {
				res.status(400).send(false);
			}
			else {
				req.user.removeShades(shades._id, function (success) {
					if(success) {
						res.send(shades);
					}
					else res.status(400).send(false);
				})
			}
		})
	},
	interactionShades: function (req, res, next) {
		Shades.findById(req.params.shadesId, function (err, shades) {
			if(!!err) {
				res.status(400).send(false);
			}
			if(!!shades) {
				if(req.user.shades.indexOf(shades) > -1) {
					req.interactionShades = shades;
				}
				else res.status(403).send('Not authorized');
			}
			else {
				res.status(400).send(false);
			}
		})
	}
}