const express = require("express");

const projectsController = require("../controllers/project");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

//router.get("/", isAuth, projectsController.getProjects);

router.post("/is-admin", isAuth, projectsController.isAdmin);

router.get("/admin-projects", isAuth, projectsController.getAdminProjects);
router.get("/:id/members", isAuth, projectsController.getMembers);

router.get("/:id/tasks", isAuth, projectsController.getTasks);

router.get("/:id", isAuth, projectsController.getProject);

router.post("/create", isAuth, projectsController.addProject);

router.put("/:id", projectsController.editProject);
router.delete("/:id", isAuth, projectsController.deleteProject);

router.post("/add-member", isAuth, projectsController.addMember);
router.post("/revoke-member", isAuth, projectsController.revokeMember);

module.exports = router;
