var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//Tokens use the JSON Web Token Spec:
//http://tools.ietf.org/html/draft-ietf-oauth-json-web-token-20

//Express middleware that let's us use JWT
//https://github.com/auth0/express-jwt
var expressJwt = require('express-jwt');

//Node implementation of JWT spec
//https://github.com/auth0/node-jsonwebtoken
var jwt = require('jsonwebtoken');

//This should be a string or buffer containing either the secret for HMAC algorithms
//or the PEM encoded public key for RSA and ECDSA
var secret = 'ABCDEFGHIJKLMNOP';

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({secret: secret}));
app.use(bodyParser());

app.post('/authenticate', function(req, res) {

	var body = req.body;
	var username = body.username;
	var password = body.password;

	if (username == 'gthrive' && password == 'password') {
		var profile = {
			email: 'app@gthrive.com',
			id: 123
		};
		var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
		//bodyParser encodes this as JSON
		res.send({ token: token });
	} else {
		res.send(401, 'Invalid username/password');
	}
});

app.get('/api/gauges', function(req, res) {
	console.log('user ' + req.user.email + 'is accessing /api/gauges');
	res.send({
		foo: 'bar'
	});
});

app.use(express.static(__dirname + '/../public'));

app.listen(3000);
console.log('Listening on port 3000...');