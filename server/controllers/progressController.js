const Progress = require('../models/Progress');
const Group = require('../models/Group');

// Log or update reading progress
const updateProgress = async (req, res) => {
  const { groupId, bookId, pagesRead } = req.body

  let progress = await Progress.findOne({
    user: req.user._id,
    group: groupId,
    book: bookId,
  })

  if (progress) {
    progress.pagesRead = pagesRead
    progress.lastUpdated = Date.now()
    await progress.save()
  } else {
    progress = await Progress.create({
      user: req.user._id,
      group: groupId,
      book: bookId,
      pagesRead,
    })
  }

  // Update streak
  const user = await require('../models/User').findById(req.user._id)
  const today = new Date()
  const lastRead = user.lastReadDate ? new Date(user.lastReadDate) : null

  const isToday = lastRead &&
    lastRead.getDate() === today.getDate() &&
    lastRead.getMonth() === today.getMonth() &&
    lastRead.getFullYear() === today.getFullYear()

  const isYesterday = lastRead &&
    today - lastRead < 2 * 24 * 60 * 60 * 1000 &&
    !isToday

  if (!isToday) {
    user.streak = isYesterday ? user.streak + 1 : 1
    user.lastReadDate = today
    await user.save()
  }

  res.json({ progress, streak: user.streak })
}

// Get progress for all members in a group
const getGroupProgress = async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: 'Group not found' });
  }

  const progress = await Progress.find({ group: groupId })
    .populate('user', 'name avatar')
    .populate('book', 'title pages');

  res.json(progress);
};

// Get my progress in a group
const getMyProgress = async (req, res) => {
  const { groupId } = req.params;

  const progress = await Progress.findOne({
    user: req.user._id,
    group: groupId,
  }).populate('book', 'title pages cover');

  if (!progress) {
    return res.status(404).json({ message: 'No progress found' });
  }

  res.json(progress);
};

module.exports = { updateProgress, getGroupProgress, getMyProgress };
