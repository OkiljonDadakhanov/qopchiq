import { Router } from "express";
import {
        getListings,
        createListing,
        getListingById,
        updateListing,
        deleteListing,
} from "../controllers/listings.controller.js";

const router = Router();

router.get("/", getListings);
router.post("/", createListing);
router.get("/:id", getListingById);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
