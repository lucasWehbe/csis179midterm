const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const Geofence = sequelize.define('Geofence', {
  geofence_id: {
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
  geofence_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  geofence_latitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  geofence_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  geofence_radius: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'geofences',
  timestamps: false,
});

Geofence.associate = (models) => {
  Geofence.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};


module.exports = Geofence;
