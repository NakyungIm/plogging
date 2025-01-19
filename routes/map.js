const express = require('express');
const axios = require('axios');
const router = express.Router();
const cors = require('cors');
router.use(cors());
require('dotenv').config();

const isValidLatLng = (latLng) => {
  if (!latLng) return false;
  const [lat, lng] = latLng.split(',').map(parseFloat);
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

router.get('/', async (req, res) => {
  const { origins, destinations } = req.query;

  if (!origins || !destinations) {
    return res.status(400).json({ error: 'Origins and destinations are required' });
  }

  if (!isValidLatLng(origins) || !isValidLatLng(destinations)) {
    return res.status(400).json({ error: 'Invalid origins or destinations format' });
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins,
        destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const data = response.data;

    if (data.rows && data.rows.length > 0) {
      const result = {
        origin: data.origin_addresses[0],
        destination: data.destination_addresses[0],
        distance: data.rows[0].elements[0].distance.text,
        duration: data.rows[0].elements[0].duration.text,
      };
      return res.json(result);
    }

    res.status(404).json({ error: 'No results found' });
  } catch (error) {
    console.error('Error fetching distance:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch distance from Google Maps API' });
  }
});

module.exports = router;