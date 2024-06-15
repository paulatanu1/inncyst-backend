const BaseSeeder = require("./BaseSeeder");
const User = require("../auth/auth.model");
const mongoose = require("mongoose");

module.exports = class Admin extends BaseSeeder {
  async run() {
    try { 
      console.log("running admin seeder");
      const user = {
        name: "Admin Admin",
        email: "admin@inncyst.com",
        password: "admin@123",
        role: "admin",
        verified: true,
      };
      const isUserExist = await User.findOne({ email: "admin@inncyst.com" });
      if (isUserExist) {
        console.log("User exist");
        mongoose.disconnect();
        return;
      }
      await User.create(user);
      console.log("Admin created!");
      mongoose.disconnect();
    } catch (e) {
      console.log(e);
    }
  }
};
