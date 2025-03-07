
import express from "express";
import designCltr from "../controller/designController.js";
import { validateDesignInput } from "../middleware/validateInput.js";

const router = express.Router();

router.post("/", validateDesignInput, designCltr.createDesign); // Create a new design
router.get("/", designCltr.getDesigns); // Get all designs
router.get("/:id", designCltr.getDesignById); // Get design by ID
router.put("/:id", validateDesignInput, designCltr.updateDesign); // Update a design
router.delete("/:id", designCltr.deleteDesign); // Delete a design

export default router;
