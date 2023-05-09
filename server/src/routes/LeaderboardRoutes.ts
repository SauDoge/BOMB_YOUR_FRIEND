import express from "express";
import { existLeaderboardCredentialMiddleware } from "../middlewares/index";
import controller from "../controllers/LeaderboardController";

const router = express.Router();

router.get("/", controller.getLeaderboard);
router.post(
  "/",
  existLeaderboardCredentialMiddleware,
  controller.updateLeaderboard
);

export = router;
