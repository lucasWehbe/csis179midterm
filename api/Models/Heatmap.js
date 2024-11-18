const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const HeatmapData = sequelize.define('HeatmapData', {
    heatmap_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    data_source: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    severity_level: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'heatmap_data',
    timestamps: false,
  });
  
  module.exports = HeatmapData;
  