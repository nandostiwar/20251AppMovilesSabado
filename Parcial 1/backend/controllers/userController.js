const User = require('../models/User')

exports.actualizarUser = async (req, res) => {
  const { id } = req.params
  const datos = req.body
  const user = await User.findByIdAndUpdate(id, datos, { new: true })
  res.json(user)
}
