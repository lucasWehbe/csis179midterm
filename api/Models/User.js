const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

   user_username: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  
   user_pass: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  user_email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },

  user_phone: {
    type: DataTypes.BIGINT,
    allowNull: true, 
    unique: true,
  },

  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users', 
  timestamps: false, 
});

User.associate = (models) => {
  User.hasMany(models.Geofence, { foreignKey: 'user_id', as: 'geofences' });
  User.hasMany(models.LocationHistory, { foreignKey: 'user_id', as: 'locationHistory' });
  User.hasMany(models.SOSAlert, { foreignKey: 'user_id', as: 'sosAlerts' });
  User.hasMany(models.EmergencyContact, { foreignKey: 'user_id', as: 'emergencyContacts' });
  User.hasOne(models.MedicalInfo, { foreignKey: 'user_id', as: 'medicalInfo' });
};



module.exports = User;
