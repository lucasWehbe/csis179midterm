const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const LocationHistory = sequelize.define('LocationHistory', {
    location_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    location_latitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    location_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'location_history',
    timestamps: false,
  });

  LocationHistory.associate = (models) => {
    LocationHistory.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

  
  module.exports = LocationHistory;
  