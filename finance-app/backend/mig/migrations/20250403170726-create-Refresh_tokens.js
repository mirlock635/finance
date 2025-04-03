'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define("RefreshToken", {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      user_id: { 
          type: DataTypes.UUID, 
          allowNull: false,
          references: {
              model: "users",
              key: "id"
          },
          onDelete: "CASCADE"
      },
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
  }, {
      timestamps: false,
      tableName: "refresh_tokens",
  });

  return RefreshToken;
};

