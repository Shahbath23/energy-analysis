import BuildingDesign from "../model/buildingDesign.js";
const designCltr={}

//create a new building design
designCltr.createDesign=async(req,res)=>{
    try {
        const newDesign = await BuildingDesign.create(req.body);
        res.status(201).json(newDesign);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}
  
//get all building Design
designCltr.getDesigns= async (req, res) => {
    try {
      const designs = await BuildingDesign.find();
      res.status(200).json(designs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //get design by ID
  designCltr.getDesignById =async(req, res) => {
    try {
      const design = await BuildingDesign.findById(req.params.id);
      if (!design) return res.status(404).json({ message: "Design not found" });
      res.status(200).json(design);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //update a design
  designCltr.updateDesign=async (req, res) => {
    try {
      const updatedDesign = await BuildingDesign.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedDesign) return res.status(404).json({ message: "Design not found" });
      res.status(200).json(updatedDesign);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //delete a design
  designCltr.deleteDesign=async (req, res) => {
    try {
      const deletedDesign = await BuildingDesign.findByIdAndDelete(req.params.id);
      if (!deletedDesign) return res.status(404).json({ message: "Design not found" });
      res.status(200).json({ message: "Design deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export default designCltr