const express = require("express");
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, (req, res) => {
    res.render("welcome");
})

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("dashboard", { name: req.user.name, title: "dashboard" })

})

router.get("/user/logout", function (req, res, next) {
    req.logOut(function (err) {
        if (err) {
            return next(err)
        }

        //// Session destruction is typically handled within the callback of req.logout() or separately
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            }
            // Clear the cookie on the client side (optional but recommended)
            res.clearCookie('connect.sid', { path: '/' }); // 'connect.sid' is the default cookie name for express-session
            res.redirect('/');
        })
    })
})

/**
 * By combining req.logout() and req.session.destroy(), you ensure that the user's authentication status is cleared and the corresponding session data is completely removed from the server, effectively terminating the session.
 */

module.exports = router;