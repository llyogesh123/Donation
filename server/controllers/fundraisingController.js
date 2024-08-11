const Fundraising = require('../models/Fundraising');

// Controller to handle the creation of a fundraising page
exports.createFundraising = async (req, res) => {
  try {
    const { name, image, price, description } = req.body;

    // Validate input
    if (!name || !image || !price || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new fundraising page
    const newFundraising = new Fundraising({
      name,
      image,
      price,
      description
    });

    await newFundraising.save();
    res.status(201).json({ message: 'Fundraising page created successfully', fundraising: newFundraising });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getFundraising = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch fundraising page from the database
      const fundraising = await Fundraising.findById(id);
  
      if (!fundraising) {
        return res.status(404).json({ message: 'Fundraising page not found' });
      }
  
      res.status(200).json(fundraising);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.getAllFundraising = async (req, res) => {
    try {
      // Fetch all fundraising pages from the database
      const fundraisings = await Fundraising.find();
  
      res.status(200).json(fundraisings);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };