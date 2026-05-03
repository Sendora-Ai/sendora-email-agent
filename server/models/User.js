// models/User.js
import mongoose from "mongoose";

export default mongoose.model("User", new mongoose.Schema({
  email: String,
  name: String,
  googleId: String,
  accessToken: String,
  refreshToken: String,
  profileDescription: {
    type: String,
    default: "",
    maxlength: 2000
  },

  labels: [{
    name: String,
    id: String,
    tone: {
      type: String,
      enum: ["formal", "casual", "friendly"],
      default: "friendly"
    },
    action: {
      type: {
        type: String,
        enum: ["reply", "draft", "none"],
        default: "none"
      },
      template: String
    },
    markAsRead: {
      type: Boolean,
      default: true
    },
    enabled: {
      type: Boolean,
      default: true
    }
  }]
}));
