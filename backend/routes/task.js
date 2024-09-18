const express = require("express");

const taskController = require("../controllers/task");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/:id", isAuth, taskController.getTask);

router.post("/create", isAuth, taskController.createTask);

router.put("/:id", isAuth, taskController.editTask);

router.delete("/:id", isAuth, taskController.deleteTask);

module.exports = router;
