import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import { getGmail } from "../services/gmail.service.js";

const router = express.Router();

const findUserLabel = (user, labelId) =>
  user?.labels.find(label =>
    String(label._id) === labelId ||
    label.id === labelId
  );

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("labels");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.labels);
});

router.post("/", auth, async (req, res) => {
  const { name, action, tone = "friendly", markAsRead, enabled = true } = req.body;

  const cleanName = name?.trim();
  const cleanTone = ["formal", "casual", "friendly"].includes(tone)
    ? tone
    : "friendly";
  const cleanAction = {
    type: ["reply", "draft", "none"].includes(action?.type) ? action.type : "none",
    template: action?.template || ""
  };
  const cleanMarkAsRead = typeof markAsRead === "boolean"
    ? markAsRead
    : cleanAction.type !== "draft";
  const cleanEnabled = typeof enabled === "boolean" ? enabled : true;

  if (!cleanName) {
    return res.status(400).json({ message: "Label name is required" });
  }

  const user = await User.findById(req.user.id);
  const gmail = await getGmail(user);

  const existing = user.labels.find(l => l.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) {
    existing.tone = cleanTone;
    existing.markAsRead = cleanMarkAsRead;
    existing.enabled = cleanEnabled;
    existing.action = cleanAction;
    await user.save();
    return res.json(existing);
  }

  const resp = await gmail.users.labels.create({
    userId: "me",
    requestBody: { name: cleanName }
  });

  const newLabel = {
    name: cleanName,
    id: resp.data.id,
    tone: cleanTone,
    markAsRead: cleanMarkAsRead,
    enabled: cleanEnabled,
    action: cleanAction
  };

  user.labels.push(newLabel);
  await user.save();

  res.json(newLabel);
});

router.patch("/:labelId", auth, async (req, res) => {
  const { action, tone, markAsRead, enabled } = req.body;
  const user = await User.findById(req.user.id);
  const label = findUserLabel(user, req.params.labelId);

  if (!label) {
    return res.status(404).json({ message: "Label not found" });
  }

  if (tone) {
    label.tone = ["formal", "casual", "friendly"].includes(tone)
      ? tone
      : label.tone;
  }

  if (action) {
    label.action = {
      type: ["reply", "draft", "none"].includes(action.type) ? action.type : label.action?.type || "none",
      template: action.template || label.action?.template || ""
    };
  }

  if (typeof markAsRead === "boolean") {
    label.markAsRead = markAsRead;
  }

  if (typeof enabled === "boolean") {
    label.enabled = enabled;
  }

  await user.save();
  res.json(label);
});

router.delete("/:labelId", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const label = findUserLabel(user, req.params.labelId);

  if (!label) {
    return res.status(404).json({ message: "Label not found" });
  }

  label.enabled = false;
  await user.save();

  res.json(label);
});

export default router;
