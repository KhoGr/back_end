import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Session = sequelize.define("Session", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    refreshToken: { type: DataTypes.STRING, allowNull: false }
});

export default Session;
