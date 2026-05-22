import User from '../models/User.js';

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  bio: user.bio || '',
});

export const updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name?.trim()) user.name = name.trim();
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) {
    if (avatar && avatar.length > 600000) {
      return res.status(400).json({ message: 'Avatar image is too large (max ~500KB)' });
    }
    user.avatar = avatar;
  }

  await user.save();
  res.json({ user: formatUser(user), message: 'Profile updated' });
};
