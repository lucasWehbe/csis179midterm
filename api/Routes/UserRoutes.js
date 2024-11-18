const express = require("express");
const router = express.Router();
const authToken = require("../Middleware/AuthToken");

const {
    getUserByIdController,
    getAllUsersController,
    createUserController,
    updateUserController,
    deleteUserController,
} = require("../Controllers/UserController");

const authenticateUserController = require('../Controllers/UserAuthController')

const {
    insertUserValidation,
    updateUserValidation,
} = require("../Validators/UserValidator");

const {validateRequest} = require('../Middleware/ValidateRequest');


router.get("/:id",  getUserByIdController);
router.get("/", authToken, getAllUsersController);
router.post("/", insertUserValidation, validateRequest,createUserController);
router.put("/:id", updateUserValidation, validateRequest, updateUserController);
router.delete("/:id", authToken, deleteUserController);

router.post("/auth/login", authenticateUserController);

module.exports = router;