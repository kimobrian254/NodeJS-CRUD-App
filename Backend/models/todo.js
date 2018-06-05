"use strict";
const uuid = require("uuid/v1");
module.exports = (sequelize, DataTypes) => {
  let Todo = sequelize.define("Todo", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid()
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Todo.associate = (models) => {
    Todo.hasMany(models.TodoItem, {
      foreignKey: "todoId",
      as: "todoItems",
    }),
    Todo.belongsTo(models.User, {
      foreignKey: "userId",
      delete: "CASCADE"
    });
  };
  return Todo;
};
