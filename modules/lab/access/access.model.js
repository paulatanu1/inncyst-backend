const mongoose = require("mongoose");
const permissions = require("../../common/permissions");

const createPermissionsSchema = () => {
  const permissionSchema = {};
  for(let permission in permissions){
    permissionSchema[permission] = Boolean
  }

  return permissionSchema
}

const AccessSchema = new mongoose.Schema({
  role: String,
  permissions: createPermissionsSchema(),
  lab: {
    type: mongoose.Schema.ObjectId,
    ref: "Lab",
    required: true,
  }
});

module.exports = AccessSchema;
