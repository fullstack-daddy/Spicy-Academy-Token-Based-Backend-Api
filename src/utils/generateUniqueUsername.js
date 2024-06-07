// Helper function to generate a unique username

import pendingAdmin from "../models/pendingAdminModel.js";
import Admin from "../models/adminModel.js";

export const generateUniqueUsername = async (firstName, lastName) => {
    const baseUsername = `${firstName}.${lastName}`;
    let username = baseUsername;
    let counter = 1;
  
    while (true) {
      // Check if the username exists in either pendingAdmin or Admin collections
      const existingPendingAdmin = await pendingAdmin.findOne({ username });
      const existingApprovedAdmin = await Admin.findOne({ username });
  
      if (!existingPendingAdmin && !existingApprovedAdmin) {
        // Username is unique, return it
        return username;
      }
  
      // If username exists, append a number and try again
      username = `${baseUsername}${counter}`;
      counter++;
    }
  };