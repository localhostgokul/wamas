/**
 * User Controller Module
 * Handles CRUD operations for user management
 * @module userController
 * @requires ../models - Database models
 * @requires ../routes/verifyToken - Token verification middleware
 */

/**
 * Retrieves all users from the database
 * @function findAll
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Sends array of all users or error message
 * @throws {Error} Returns 500 status with error message if query fails
 */

/**
 * Retrieves a single user by ID
 * @function findOne
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to retrieve
 * @param {Object} res - Express response object
 * @returns {void} Sends user object or error message
 * @throws {Error} Returns 409 status with error message if query fails
 */

/**
 * Updates an existing user by ID
 * @function update
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to update
 * @param {Object} req.body - Updated user data
 * @param {Object} res - Express response object
 * @returns {void} Sends success message or error
 * @throws {Error} Returns 404 if user not found, 409 for other errors
 */

/**
 * Deletes a user by ID
 * @function delete
 * @param {Object} req - Express request object
 * @param {string} req.params.id - User ID to delete
 * @param {Object} res - Express response object
 * @returns {void} Sends deletion confirmation or error message
 * @throws {Error} Returns 404 if user not found, 409 for other errors
 */
const db = require("../models");
const user = db.users;
// const verify = require("../routes/verifyToken");

exports.findAll = (req, res) => {
user
    .find()
    .then((result) => {
    res.send(result);
    })
    .catch((err) => {
    res.status(500).send({
        message: err.message,
    });
    });
};

/*exports.create=(req,res) => {
  //validate 1st
const validate = joi.validate(req.body,schema);
res.send(validate);
const adminpost = new admin({
    admin_email: req.body.admin_email,
    admin_username : req.body.admin_username,
    admin_nama : req.body.admin_nama,
    admin_pwd:req.body.admin_pwd,
    admin_foto:req.body.admin_foto,
    admin_isactive:req.body.admin_isactive ? req.body.admin_isactive : false
})

adminpost.save(adminpost)
.then((result)=>{
    res.send(result)
}).catch((err)=>{
    res.status(409).send({
        message:err.message
    })
});
}
*/

exports.findOne = (req, res) => {
const id = req.params.id;

user
    .findById(id)
    .then((result) => {
    res.send(result);
    })
    .catch((err) => {
    res.status(409).send({
        message: err.message,
    });
    });
};

exports.update = (req, res) => {
const id = req.params.id;

user
    .findByIdAndUpdate(id, req.body)
    .then((result) => {
    if (!result) {
        res.status(404).send({
        message: "Not Found",
        });
    }
    res.send({
        message: "updated",
    });
    })

    .catch((err) => {
    res.status(409).send({
        message: err.message,
    });
    });
};

exports.delete = (req, res) => {
const id = req.params.id;

user
    .findByIdAndDelete(id)
    .then((result) => {
    if (!result) {
        res.status(404).send({
        message: "Not Found",
        });
    }
    res.send({
        message: "Deleted",
    });
    })

    .catch((err) => {
    res.status(409).send({
        message: err.message,
    });
    });
};
