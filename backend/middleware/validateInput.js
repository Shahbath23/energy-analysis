// Validate design creation and update
export const validateDesignInput = (req, res, next) => {
    const { name, dimensions, wwr, shgc } = req.body;
  
    // Validate name
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: "Name is required and must be a string." });
    }
  
    // Validate dimensions
    if (!dimensions || typeof dimensions !== 'object') {
      return res.status(400).json({ message: "Dimensions are required and must be an object." });
    }
  
    const directions = ["north", "south", "east", "west"];
    for (const direction of directions) {
      if (!dimensions[direction] || typeof dimensions[direction] !== 'object') {
        return res.status(400).json({ message: `${direction} dimensions are required and must be an object.` });
      }
  
      const { width, height } = dimensions[direction];
      if (typeof width !== 'number' || typeof height !== 'number') {
        return res.status(400).json({ message: `${direction} width and height must be numbers.` });
      }
      if (width <= 0 || height <= 0) {
        return res.status(400).json({ message: `${direction} width and height must be positive numbers.` });
      }
    }
  
    // Validate WWR
    if (!wwr || typeof wwr !== 'object') {
      return res.status(400).json({ message: "WWR is required and must be an object." });
    }
  
    for (const direction of directions) {
      if (typeof wwr[direction] !== 'number' || wwr[direction] < 0 || wwr[direction] > 1) {
        return res.status(400).json({ message: `${direction} WWR must be between 0 and 1.` });
      }
    }
  
    // Validate SHGC
    if (typeof shgc !== 'number' || shgc < 0 || shgc > 1) {
      return res.status(400).json({ message: "SHGC must be a number between 0 and 1." });
    }
  
    // Proceed to the next middleware if everything is valid
    next();
  };
  