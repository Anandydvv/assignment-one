import { DataTypes, Model, Optional } from "sequelize";
import getSequelize from "../lib/sequelize";

export interface StageAttributes {
  id: number;
  stage: string;
  output: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StageCreationAttributes = Optional<StageAttributes, "id">;

class Stage
  extends Model<StageAttributes, StageCreationAttributes>
  implements StageAttributes
{
  declare id: number;
  declare stage: string;
  declare output: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function getStageModel() {
  const sequelize = getSequelize();

  if (!sequelize.models.Stage) {
    Stage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        stage: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        output: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Stage",
        tableName: "stages",
        indexes: [{ unique: true, fields: ["stage"] }],
      }
    );
  }

  return sequelize.models.Stage as typeof Stage;
}

export default Stage;

