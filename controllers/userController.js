const conn = require('../model/db')
const bcrypt = require("bcryptjs")
function initRoute() {
    return {
        login(req, res) {
            res.render("auth/login", { title: "Our Login Page!", layout: "layouts/auth" })
        },
        register(req, res) {
            res.render("auth/register", { title: "Register User Page!", layout:"layouts/auth" })
        },

        async registerUser(req, res) {
            const { name, email, password, password2 } = req.body;
            // console.log(name, email)
            if (!name || !email || !password || !password2) {
                req.flash("error", "Please enter name, email, and password");
                req.flash("name", name);
                req.flash("email", email);
                req.flash("password", password);
                req.flash("password2")
                res.render("register")
            }
            if (password.length < 6) {
                req.flash("error", "Password length should be at least 6 characters!");
                req.flash("name", name);
                req.flash("email", email);
                req.flash("password", password);
                req.flash("password2", password2);
                res.render("register")
            }
            if (password != password2) {
                req.flash("error", "Password does not match!");
                req.flash("name", name);
                req.flash("email", email);
                req.flash("password", password);
                req.flash("password2", password2);
                res.render("register")
            }

            try {
                const query = "select * from userregister where email = ?";
                const [rows] = await conn.query(query, [email]);

                if (rows.length > 0) {
                    //console.log(rows)
                    req.flash("error", "User already exist with this email!");
                    req.flash("name", name);
                    req.flash("email", email);
                    req.flash("password", password);
                    req.flash("password2", password2);
                    res.render("register")

                } else {
                    // console.log("User not found")
                    const saltRound = 10; // 10 is a common and secure number of round
                    try {

                        const hash = await bcrypt.hash(password, saltRound);
                        // console.log(hash)
                        const hashedPassword = hash;
                        // SQL query with a placeholder (?) for values
                        const userAccount = "insert into userregister (name, email, password, password2) values(?, ?, ?, ?)";
                        conn.query(userAccount, [name, email, hashedPassword, password2], (err, result) => {
                            if (err) {
                                console.error(err);
                                // Handle error: perhaps redirect to an error page
                                res.redirect('/user/register');
                                return;
                            }
                            // console.log('1 record inserted');
                            // Redirect to a success page after successful insertion
                            
                        })
                        req.flash("success","You are successfully registered and can login!")
                        res.redirect('/user/login');

                    } catch (error) {
                        console.error("Error hasing user password", error);
                        // throw error
                    }
                }
            } catch (error) {
                console.error("Error fetching user by email", error);
                throw error;

            }
        }
    }
}

module.exports = initRoute;