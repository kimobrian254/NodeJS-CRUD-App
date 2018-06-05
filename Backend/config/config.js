const Sequelize = require("sequelize");
module.exports = {
  "development": {
    "username": "postgres",
    "password": "",
    "database": "todos-dev",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres",
    "pool": {
      "max": 5,
      "min": 0,
      "idle": 10000
    },
    "operatorsAliases": Sequelize.Op,
  },
  "test": {
    "username": "postgres",
    "password": "",
    "database": "database_test",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "",
    "database": "database_production",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  }
};
