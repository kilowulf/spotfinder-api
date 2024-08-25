const mongoose = require("mongoose");
const { Schema } = mongoose;
// Refrain from exporting / importing models since mongoose
// can throw errors when it thinks your bringing in multiple instances of a model
// single instance should persist in the app
const userSchema = new Schema({
  // can add multiple properties if needed
  githubId: Number,
  username: String,
  displayname: String,
  provider: String,
  profileUrl: String,
  avatarImgUrl: String,
  languages: { type: [String], default: [] },
  frameworks: { type: [String], default: [] },
  projectsTracked: { type: [Object], default: [] },
  experienceLevel: String,
  bio: String
});

mongoose.model("users", userSchema);
