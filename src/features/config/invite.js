import mongoose from "mongoose"


const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending", // pending → accepted
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const Invite = mongoose.model("Invite", inviteSchema);