import { DataTypes } from "sequelize";
import sequelize from "../lib/sequelize";

const Stage = sequelize.define("Stage", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  stage: { type: DataTypes.INTEGER, allowNull: false },
  output: { type: DataTypes.TEXT, allowNull: false },
});

export default Stage;
