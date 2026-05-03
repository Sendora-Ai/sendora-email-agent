import express from "express";
import auth from "../middleware/auth.js";
import EmailAction from "../models/EmailAction.js";

const router = express.Router();

const asPositiveInt = (value, fallback, max = 100) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

router.get("/summary", auth, async (req, res) => {
  const userId = req.user.id;

  const [unchecked, drafts, replies, total] = await Promise.all([
    EmailAction.countDocuments({ userId, checked: false }),
    EmailAction.countDocuments({ userId, type: "draft" }),
    EmailAction.countDocuments({ userId, type: "reply" }),
    EmailAction.countDocuments({ userId })
  ]);

  res.json({ unchecked, drafts, replies, total });
});

router.get("/", auth, async (req, res) => {
  const { checked, type, label, q } = req.query;
  const page = asPositiveInt(req.query.page, 1, 10000);
  const limit = asPositiveInt(req.query.limit, 20, 100);
  const skip = (page - 1) * limit;

  const filter = { userId: req.user.id };

  if (checked === "true") filter.checked = true;
  if (checked === "false") filter.checked = false;
  if (["reply", "draft"].includes(type)) filter.type = type;
  if (label) filter.label = label;
  if (q) {
    filter.$or = [
      { subject: { $regex: q, $options: "i" } },
      { to: { $regex: q, $options: "i" } },
      { body: { $regex: q, $options: "i" } }
    ];
  }

  const [items, total] = await Promise.all([
    EmailAction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    EmailAction.countDocuments(filter)
  ]);

  res.json({
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  });
});

router.patch("/:id/check", auth, async (req, res) => {
  const checked = req.body.checked !== false;

  const action = await EmailAction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    {
      checked,
      checkedAt: checked ? new Date() : null
    },
    { new: true }
  );

  if (!action) {
    return res.status(404).json({ message: "Email action not found" });
  }

  res.json(action);
});

export default router;
