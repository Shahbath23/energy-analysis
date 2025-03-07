
import mongoose from "mongoose";

const buildingDesignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dimensions: {
    north: { height: Number, width: Number },
    south: { height: Number, width: Number },
    east: { height: Number, width: Number },
    west: { height: Number, width: Number },
  },
  wwr: {
    north: { type: Number, min: 0, max: 1 },
    south: { type: Number, min: 0, max: 1 },
    east: { type: Number, min: 0, max: 1 },
    west: { type: Number, min: 0, max: 1 },
  },
  shgc: { type: Number, min: 0, max: 1, required: true },
  skylight: {
    height: { type: Number },
    width: { type: Number },
  },
}, {
  timestamps: true
});

const BuildingDesign = mongoose.model("BuildingDesign", buildingDesignSchema);

export default BuildingDesign;
