const express = require("express");
const multer = require("multer");
conn = require("../model/db");
// const upload = multer({dest: "uploads/"}); // Initialize multer for parsing multipart/form-data
const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Admin Controller
const adminController = require("../controllers/adminController");


router.get("/", forwardAuthenticated, (req, res) => {
    res.render("welcome", { layout: "layouts/auth" });
})

router.get("/dashboard", ensureAuthenticated, (req, res) => {
    res.render("admin/dashboard", { name: req.user.name, title: "dashboard" })

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


/* ------------------ Multer Config ------------------ */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });




/* ------------------Students Routes ------------------ */

router.get('/saveStudent', ensureAuthenticated, adminController().saveStudentInfo);

router.post(
    '/registers',
    upload.fields([
        { name: 'Tazkira', maxCount: 1 },
        { name: 'Paracha', maxCount: 1 },
        { name: 'Attachments', maxCount: 5 },
        { name: 'stImage', maxCount: 1 }
    ]),
    ensureAuthenticated, adminController().registerStudent
);

/**
 * By combining req.logout() and req.session.destroy(), you ensure that the user's authentication status is cleared and the corresponding session data is completely removed from the server, effectively terminating the session.
 */

router.get('/studentList', ensureAuthenticated, adminController().listStudents);

module.exports = router;