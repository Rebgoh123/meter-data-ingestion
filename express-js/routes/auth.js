var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');


/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a username and password.
 * The strategy parses the username and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function verify(username, password, cb) {
      db.query('SELECT * FROM users WHERE username = ?', [username],
          function(err, rows) {
            if (err) {
              return cb(err);
            }
            if (rows.length === 0) {
              return cb(null, false, { message: 'Incorrect username or password.' });
            }
            const row = rows[0];
            crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
              if (err) {
                return cb(err);
              }
              if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
              }
              return cb(null, row);
            });
          });
    }
));

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


var router = express.Router();

/* POST /login/password
 *
 * This route authenticates the user by verifying a username and password.
 *
 * A username and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The username and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * username and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 */
router.post('/login', passport.authenticate('local', {
      failureMessage: true,
      failWithError: true
    }),
    function(req, res) {
      const sessionToken = req.sessionID; // Get session ID

      res.json({
        success: true,
        message: 'Authenticated successfully',
        result: {
            sessionToken: sessionToken,
            user: req.user.username,
        }
      });
    },
    function(err, req, res) {
      if (err.name === 'InvalidPasswordError') {
        return res.status(401).json({
          ok: false,
          message: 'Invalid username or password'
        });
      } else if (err.name === 'UserNotFoundError') {
        return res.status(404).json({
          ok: false,
          message: 'User not found'
        });
      } else {
        return res.status(500).json({
          ok: false,
          message: 'Internal Server Error'
        });
      }
    });

/* POST /logout
 *
 * This route logs the user out.
 */
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post('/signup', function(req, res, next) {
    // Generate a random salt
    const salt = crypto.randomBytes(16)
    // Hash the password synchronously
    var hashedPassword = crypto.pbkdf2Sync(req.body.password, salt, 310000, 32, 'sha256');

    // Insert the new user into the database
    db.query('INSERT IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
        req.body.username,
        hashedPassword,
        salt
    ], function(err, result) {
        if (err) {
            console.error('error inserting user:', err);
            return next(err); // Handle any errors during the query
        }

        // Respond with success message
        res.json({
            success: true,
            message: 'Created successfully',
            result: {
                id: result.insertId, // Correctly retrieve the last inserted ID
                user: req.body.username,
            }
        });
    });
});
module.exports = router;
