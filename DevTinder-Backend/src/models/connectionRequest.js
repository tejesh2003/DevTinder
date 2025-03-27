const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "rejected", "accepted"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ sender: 1, receiver: 1 });
connectionRequestSchema.index({ receiver: 1, status: 1 });

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
