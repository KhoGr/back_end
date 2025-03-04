const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Token extends Model {
    static associate(models) {
      Token.belongsTo(models.Account, {
        foreignKey: 'account_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Token.init(
    {
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'Tokens',
      modelName: 'Token',
      timestamps: true,
      underscored: true,
    }
  );

  return Token;
};
