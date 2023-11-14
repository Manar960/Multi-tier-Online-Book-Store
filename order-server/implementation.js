const catalogServiceUrl = 'http://localhost:3004';

exports.purchase = async (req, res) => {
  const { book_id } = req.params;
  try {
    const response = await axios.get(`${catalogServiceUrl}/buy/${book_id}`);
  const data = response.data;
  res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process the purchase.' });
  }
}
