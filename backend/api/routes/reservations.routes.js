import { Router } from "express";
import {
        getReservations,
        createReservation,
        getReservationById,
        updateReservation,
        deleteReservation,
} from "../controllers/reservations.controller.js";

const router = Router();

router.get("/", getReservations);
router.post("/", createReservation);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);

export default router;
