const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const SOSAlert = sequelize.define('SOSAlert', {
    sos_id: {
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
    latitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    sos_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    triggered_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'sos_alerts',
    timestamps: false,
  });

  SOSAlert.associate = (models) => {
    SOSAlert.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

  
  module.exports = SOSAlert;
  