const Group = require('../models/Group');
const crypto = require('crypto');

// Create a group
const createGroup = async (req, res) => {
  const { name, targetDate } = req.body;

  const inviteCode = crypto.randomBytes(6).toString('hex');

  const group = await Group.create({
    name,
    targetDate,
    inviteCode,
    members: [{ user: req.user._id, role: 'admin' }],
  });

  res.status(201).json(group);
};

// Join a group via invite code
const joinGroup = async (req, res) => {
  const { inviteCode } = req.body;

  const group = await Group.findOne({ inviteCode });

  if (!group) {
    return res.status(404).json({ message: 'Group not found' });
  }

  const alreadyMember = group.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (alreadyMember) {
    return res.status(400).json({ message: 'Already a member of this group' });
  }

  group.members.push({ user: req.user._id, role: 'member' });
  await group.save();

  res.json(group);
};

// Get a group by ID with members and book populated
const getGroup = async (req, res) => {
  const group = await Group.findById(req.params.id)
    .populate('members.user', 'name avatar email')
    .populate('book');

  if (!group) {
    return res.status(404).json({ message: 'Group not found' });
  }

  res.json(group);
};

// Get all groups the logged in user belongs to
const getMyGroups = async (req, res) => {
  const groups = await Group.find({ 'members.user': req.user._id })
    .populate('book')
    .populate('members.user', 'name avatar');

  res.json(groups);
};

// Set the book for a group (admin only)
const setBook = async (req, res) => {
  const { bookId } = req.body;

  const group = await Group.findById(req.params.id);

  if (!group) {
    return res.status(404).json({ message: 'Group not found' });
  }

  const isAdmin = group.members.some(
    (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
  );

  if (!isAdmin) {
    return res.status(403).json({ message: 'Only admin can set the book' });
  }

  group.book = bookId;
  await group.save();

  res.json(group);
};

module.exports = { createGroup, joinGroup, getGroup, getMyGroups, setBook };
