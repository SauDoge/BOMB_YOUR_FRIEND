import express from "express";
import existRoomCredentialMiddleware from "../middlewares/existRoomCredentialMiddleware";
import controller from "../controllers/RoomController";

const router = express.Router();

router.get("/", controller.getRoom);
router.post("/", existRoomCredentialMiddleware, controller.createRoom);

export = router;
