import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.js";
import * as carController from "../controllers/car.controller.js";
import { importCSV } from "../utils/csvHandler.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// Protect all car routes
router.use(verifyJWT);

// CRUD routes
router.post("/", carController.createCar);
router.get("/", carController.getCars);
router.get("/:id", carController.getCar);
router.put("/:id", carController.updateCar);
router.delete("/:id", carController.deleteCar);

// CSV upload route
router.post("/upload-csv", upload.single("file"), importCSV);

export default router;
