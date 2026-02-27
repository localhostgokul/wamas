/**
 * Trash Data Controller
 * 
 * This controller handles all CRUD operations for trash data management.
 * It manages trash bin information including location, capacity, and current status.
 * 
 * @module trashdataController
 * @requires ../models - Database models
 * @requires ../routes/verifyToken - Token verification middleware
 */

/**
 * Retrieves all trash data records from the database.
 * 
 * @function findAll
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Sends array of trash data records or error message
 * @throws {Error} Returns 500 status with error message if query fails
 */

/**
 * Creates a new trash data record in the database.
 * 
 * @function create
 * @param {Object} req - Express request object
 * @param {string} req.body.tempat_sampah_jenis - Type of trash bin
 * @param {string} req.body.tempat_sampah_name - Name of trash bin
 * @param {string} req.body.tempat_sampah_location - Location of trash bin
 * @param {string} req.body.tempat_sampah_region - Region of trash bin
 * @param {number} req.body.tempat_sampah_maxcapacity - Maximum capacity of trash bin
 * @param {Object} res - Express response object
 * @returns {void} Sends created trash data record or error message
 * @throws {Error} Returns 409 status with error message if creation fails
 */

/**
 * Retrieves a single trash data record by ID.
 * 
 * @function findOne
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Unique identifier of trash data record
 * @param {Object} res - Express response object
 * @returns {void} Sends trash data record or error message
 * @throws {Error} Returns 409 status with error message if query fails
 */

/**
 * Updates an existing trash data record by ID.
 * 
 * @function update
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Unique identifier of trash data record to update
 * @param {Object} req.body - Fields to update in trash data record
 * @param {Object} res - Express response object
 * @returns {void} Sends success message or error message
 * @throws {Error} Returns 404 status if record not found
 * @throws {Error} Returns 409 status with error message if update fails
 */

/**
 * Deletes a trash data record by ID.
 * 
 * @function delete
 * @param {Object} req - Express request object
 * @param {string} req.params.id - Unique identifier of trash data record to delete
 * @param {Object} res - Express response object
 * @returns {void} Sends deletion confirmation or error message
 * @throws {Error} Returns 404 status if record not found
 * @throws {Error} Returns 409 status with error message if deletion fails
 */
const db = require("../models");
const trashdata = db.trashdatas;
// const verify = require("../routes/verifyToken");


exports.findAll = (_, res) => {
trashdata
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

exports.create = (req, res) => {
const trashpost = new trashdata({
    tempat_sampah_jenis: req.body.tempat_sampah_jenis,
    tempat_sampah_name: req.body.tempat_sampah_name,
    tempat_sampah_location: req.body.tempat_sampah_location,
    tempat_sampah_region: req.body.tempat_sampah_region,
    tempat_sampah_maxcapacity: req.body.tempat_sampah_maxcapacity,
    tempat_sampah_totalcapacitythismonth: 0,
    tempat_sampah_current: {
    tempat_sampah_gpslocation: {
        lon: 0,
        lat: 0
    },
    tempat_sampah_currentcapacity: 0,
    tempat_sampah_currentlevel: 0
    },
    tempat_sampah_isfull: false
});

    trashpost
    .save(trashpost)
    .then((result) => {
    res.send(result);
    })
    .catch((err) => {
    res.status(409).send({
        message: err.message,
    });
    });
};

exports.findOne = (req, res) => {
const id = req.params.id;

trashdata
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

trashdata
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

trashdata
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
