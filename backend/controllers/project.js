const Project = require("../models/project");

const User = require("../models/user");

const Task = require("../models/task");

exports.addProject = (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;
  const status = "On track";
  const chat = "chat";
  let admin;

  const project = new Project({
    name: name,
    description: description,
    admin: req.userId,
    status: status,
    chat: chat,
  });

  project
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      admin = user;
      user.projects.push(project);
      return user.save();
    })
    .then((result) => {
      console.log("Created project");
      res.status(201).json({
        message: "Project created",
        project: project,
        admin: { _id: admin._id, name: admin.email },
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error("Create project failed");
      error.statusCode = 422;
      next(err);
    });
};

//exports.getProjects = (req, res, next) => {
//  Project.find()
//    .populate("admin")
//    .then((projects) => {
//      res.json(projects);
//      console.log(projects);
//    });
//};

exports.getProject = (req, res, next) => {
  const projectId = req.params.id;
  Project.findById(projectId)
    .then((project) => {
      console.log("Project");
      res.status(200).json({
        project: project,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getMembers = (req, res, next) => {
  const projectId = req.params.id;

  User.find({ projects: { $elemMatch: { $eq: projectId } } }, "-password")
    .then((users) => {
      console.log("Project members");
      res.status(200).json({
        message: "Project members",
        members: users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.isAdmin = (req, res, next) => {
  const projectId = req.body.project;

  Project.findById(projectId)
    .then((project) => {
      if (req.userId !== project.admin.toString()) {
        console.log("Not admin");
        res.status(200).json({
          message: "Not admin",
          data: false,
        });
      } else {
        console.log("Admin");
        res.status(200).json({
          message: "Admin",
          data: true,
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addMember = (req, res, next) => {
  const projectId = req.body.project;

  Project.findById(projectId)
    .then((project) => {
      if (req.userId !== project.admin.toString()) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        throw error;
      }

      const userToAdd = req.body.userToAdd;

      return User.findOne({ email: userToAdd });
    })

    .then((user) => {
      if (user.projects && user.projects.includes(projectId)) {
        const error = new Error("Already member");
        error.statusCode = 403;
        throw error;
      }

      user.projects.push(projectId);
      return user.save();
    })
    .then((result) => {
      console.log("Member added");
      res.status(200).json({
        message: "Member added",
        // project: project,
        // admin: { _id: admin._id, name: admin.email },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.revokeMember = (req, res, next) => {
  const projectId = req.body.project;

  Project.findById(projectId)
    .then((project) => {
      if (req.userId !== project.admin.toString()) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        throw error;
      }

      const userToRevoke = req.body.userToRevoke;
      return User.findById(userToRevoke);
    })
    .then((user) => {
      if (!user.projects || !user.projects.includes(projectId)) {
        const error = new Error("Not member");
        error.statusCode = 403;
        throw error;
      }

      const remainProjects = user.projects.filter((id) => {
        id !== projectId;
      });
      user.projects = remainProjects;
      return user.save();
    })
    .then((result) => {
      console.log("Member revoked");
      res.status(200).json({
        message: "Member revoked",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAdminProjects = (req, res, next) => {
  const userId = req.userId;
  Project.find({ admin: userId })
    .then((projects) => {
      res.status(200).json({
        projects: projects,
        message: "User is admin of these projects",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getTasks = (req, res, next) => {
  const projectId = req.params.id;

  Task.find({ project: projectId })
    .then((tasks) => {
      console.log("Project tasks");
      res.status(200).json({
        message: "Project tasks",
        tasks: tasks,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
