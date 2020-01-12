import * as controller from './app';
import * as validator from './validators';
import { logger } from './utils';
import * as path from 'path';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
var admin = require("firebase-admin");

var serviceAccount = require('../oauth20-501230-firebase-adminsdk-hs8nm-4f24e23fec.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oauth20-501230.firebaseio.com"
});

const db = admin.firestore();


passport.use(
	new GoogleStrategy({
		clientID: '138526020930-41dipo69tbs3g5fqreiid4rh2idpg8sn.apps.googleusercontent.com',
		clientSecret: 'hKqt5HZ6PXGGqGnJUsj8Wl_J',
		callbackURL: '/login/google/redirect'
	}, (accessToken, refreshToken, profile, done) => {
		console.log(profile);


		const userDoc = db.collection('users').doc(profile.id);
		userDoc.get().then((doc) => {
			if (!doc.exists) {
				console.log('No such document!');
			} else {
				console.log('Document data:', doc.data());
			}
		});


		done();
	})
);
/**
 * @description - API endpoints declarations.
 * @param app - express server.
 */
export const routes = (app) => {
	//Route for addition functionality.
	app.get('/', (request, response) => {
		response.sendFile(path.join(__dirname+'/index.html'));
	});

	app.get('/login/google', passport.authenticate('google', {
		scope: ['profile']
	}))

	app.get('/login/google/redirect', passport.authenticate('google'), (request, response) => {
		response.send('Logged in successfully!!');
	})
};