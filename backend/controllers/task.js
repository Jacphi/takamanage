const Task = require("../models/task");

const Project = require("../models/project");

const projectsController = require("../controllers/project");

exports.createTask = (req, res, next) => {
  const projectId = req.body.project;

  Project.findById(projectId)
    .then((project) => {
      if (req.userId !== project.admin.toString()) {
        console.log("Not authorized");
        const error = new Error("Not authorized");
        error.statusCode = 403;
        throw error;
      }

      const name = req.body.name;
      const description = req.body.description;
      const status = "On track";
      const priority = req.body.priority;

      const task = new Task({
        name: name,
        description: description,
        status: status,
        project: project,
        priority: priority,
      });

      return task.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Task created", taskId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTask = (req, res, next) => {
  const taskId = req.params.id;
  Task.findById(taskId)
    .then((task) => {
      console.log("Task");
      res.status(200).json({
        task: task,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editTask = (req, res, next) => {
  const taskId = req.params.id;
  const updatedName = req.body.name;
  const updatedDescription = req.body.description;
  const updatedPriority = req.body.priority;
  const updatedStatus = req.body.status;

  Task.findById(taskId)
    .then((task) => {
      updatedName ? (task.name = updatedName) : "";
      updatedDescription ? (task.description = updatedDescription) : "";
      updatedPriority ? (task.priority = updatedPriority) : "";
      updatedStatus ? (task.status = updatedStatus) : "";

      return task.save();
    })
    .then((task) => {
      res.status(200).json({ message: "Task updated", taskId: task._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.id;

  Task.findById(taskId, "project")
    .populate("project")
    .then((data) => {
      const admin = data.project.admin.toString();

      if (req.userId !== admin) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        throw error;
      }

      return Task.findByIdAndDelete(taskId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Task deleted",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
