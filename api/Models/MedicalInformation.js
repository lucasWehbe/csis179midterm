const { DataTypes } = require('sequelize');
const sequelize = require('../Config/DBConfig');

const MedicalInfo = sequelize.define('MedicalInfo', {
    medical_info_id: {
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
    blood_type: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    medical_conditions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergency_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'medical_information',
    timestamps: false,
  });

  MedicalInfo.associate = (models) => {
    MedicalInfo.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

  
  module.exports = MedicalInfo;
  