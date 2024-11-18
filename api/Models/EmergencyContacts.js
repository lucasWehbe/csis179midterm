const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const EmergencyContact = sequelize.define('EmergencyContact', {
    contact_id: {
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
    contact_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    tableName: 'emergency_contacts',
    timestamps: false,
  });

  EmergencyContact.associate = (models) => {
    EmergencyContact.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

  
  module.exports = EmergencyContact;
  