'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    
    static associate(models) {
      
      Task.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',  
        onDelete: 'CASCADE' 
      });
    }
  }

  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title is required'
        },
        notEmpty: {
          msg: 'Title cannot be empty'
        },
        len: {
          args: [1, 100],
          msg: 'Title constraint'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, 
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Up to 1000 char'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'in-progress', 'completed']],
          msg: 'pending or in progress or completed stuatus'
        }
      }
    },
    dueDate: {  
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Due date must be valid'
        },
        isAfter: {
          args: new Date().toISOString(),
          msg: 'Due date must be in the future'
        }
      }
    },
    priority: {  
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium',
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { 
        model: 'Users',  
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'Tasks',  
    paranoid: true,  
    indexes: [ 
      {
        fields: ['status']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['dueDate']
      },
      {
        fields: ['priority']
      }
    ],
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'] 
      }
    },
    scopes: {
      withTimestamps: {
        attributes: { include: ['createdAt', 'updatedAt'] }
      },
      pending: {
        where: { status: 'pending' }
      },
      userTasks: (userId) => ({
        where: { userId }
      })
    }
  });

  return Task;
};