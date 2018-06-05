"use strict";
const uuid = require("uuid/v1");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Todos", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: () => uuid()
      },
      title: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      }});
  },
  down: (queryInterface/*, Sequelize*/) => {
    return queryInterface.dropTable("Todos");
  }
};
