import express from "express";
import {
  existUserCredentialMiddleware,
  addToLeaderboardMiddleware,
} from "../middlewares/index";
import controller from "../controllers/UserController";

const router = express.Router();

router.get("/test", controller.test);
router.get("/logout", controller.logout);
router.post(
  "/register",
  existUserCredentialMiddleware,
  controller.register,
  addToLeaderboardMiddleware
);
router.post("/login", existUserCredentialMiddleware, controller.login);

export = router;
