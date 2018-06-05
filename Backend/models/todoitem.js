"use strict";
const uuid = require("uuid/v1");
module.exports = (sequelize, DataTypes) => {
  let TodoItem = sequelize.define("TodoItem", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: () => uuid()
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {});
  TodoItem.associate = function (models) {
    TodoItem.belongsTo(models.Todo, {
      foreignKey: "todoId",
      onDelete: "CASCADE",
    });
  };
  return TodoItem;
};
