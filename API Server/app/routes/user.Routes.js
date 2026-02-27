/**
 * User Routes Module
 * Handles user-related HTTP endpoints including authentication and CRUD operations
 * 
 * @param {Object} app - Express application instance
 * 
 * @route GET /user - Retrieve all users
 * @route GET /user/:id - Retrieve a specific user by ID
 * @route PUT /user/:id - Update a user by ID
 * @route DELETE /user/:id - Delete a user by ID
 * @route POST /user/register - Register a new user account
 *   @bodyParam {string} user_email - User's email address (required, must be unique)
 *   @bodyParam {string} user_username - User's username (required)
 *   @bodyParam {string} user_nama - User's full name (required)
 *   @bodyParam {string} user_address - User's address (required)
 *   @bodyParam {string} user_phonenum - User's phone number (required)
 *   @bodyParam {string} user_pwd - User's password (required, will be hashed)
 *   @bodyParam {boolean} user_isAdmin - Admin status flag (required)
 *   @returns {Object} Created user object with hashed password
 *   @throws {400} - Validation error or email already exists
 * 
 * @route POST /user/login - Authenticate user and generate JWT token
 *   @bodyParam {string} user_email - User's email address (required)
 *   @bodyParam {string} user_pwd - User's password (required)
 *   @returns {Object} {result: userObject, token: jwtToken} - User data and authentication token (expires in 1 hour)
 *   @throws {400} - Validation error, email not found, or invalid password
 */
module.exports = (app) => {
    const users = require("../controllers/userController");
    const router = require("express").Router();
    const db = require("../models");
    const user = db.users;
    const {
        userregistervalidation,
        userloginvalidation,
    } = require("../../validation");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    // const verify = require("./verifyToken");

    router.get("/", users.findAll);
    router.get("/:id", users.findOne);
    router.put("/:id", users.update);
    router.delete("/:id", users.delete);
    // router.delete("/:id", verify.isAuth, verify.isAdmin, users.delete);

    router.post("/register", async (req, res) => {
        //validate 1st
        const { error } = userregistervalidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //check if exist
        const emailexist = await user.findOne({
        user_email: req.body.user_email,
    });

    if (emailexist) return res.status(400).send("Email already exist");

    //passwd hash
    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(req.body.user_pwd, salt);

    //create user
    const userpost = new user({
        user_email: req.body.user_email,
        user_username: req.body.user_username,
        user_nama: req.body.user_nama,
        user_address: req.body.user_address,
        user_phonenum: req.body.user_phonenum,
        user_pwd: hashpwd,
        user_isAdmin: req.body.user_isAdmin,
    });

    try {
        const saveduser = await userpost.save();
        res.send(saveduser);
    } catch (err) {
        res.status(400).send(err);
    }
    });

    router.post("/login", async (req, res) => {
        //validate 1st
        const { error } = userloginvalidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

    //check if exist
    const userexist = await user.findOne({
        user_email: req.body.user_email,
    });

    if (!userexist) return res.status(400).send("Email doesnt exist");

    //pass is correct
    const validpwd = await bcrypt.compare(
        req.body.user_pwd,
        userexist.user_pwd
    );
    if (!validpwd) return res.status(400).send("Invalid Password");

    const token = jwt.sign(
        {
            id: userexist.id,
            isAdmin: userexist.user_isAdmin,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "1h",
        }
    );

    res.status(200).json({result: userexist, token})
    // res.header("auth-token", token).send(token);
});

app.use("/user", router);
};
