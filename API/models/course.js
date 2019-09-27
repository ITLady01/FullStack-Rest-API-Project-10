"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Provide a value for course title"
          }
        }
      },
      userId: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Provide a value for course description"
          }
        }
      },
      estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
      },
      materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {
       sequelize 
    }
  );
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: "userId",
        field: "userId",
        allowNull: false,
        onDelete: "cascade"
      }
    });
  };

  return Course;
};
