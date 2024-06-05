import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, expires: '1h', default: Date.now } // Tokens will be removed after 1hr
});

const Blacklist = mongoose.model("Blacklist", blacklistSchema);
export default Blacklist;
