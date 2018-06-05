"use strict";
const uuid = require("uuid/v1");
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define("User", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid()
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Todo, {
      foreignKey: "userId",
      as: "todos",
    });
  };
  return User;
};
