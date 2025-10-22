import { DataTypes, Model, Optional } from "sequelize";
import getSequelize from "../lib/sequelize";

interface StageAttributes {
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
  public id!: number;
  public stage!: string;
  public output!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function getStageModel() {
  const sequelize = getSequelize();
  // Initialize once per process
  if (!sequelize.models.Stage) {
    Stage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        stage: {
          type: DataTypes.STRING,
          allowNull: false,
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
      }
    );
  }
  return sequelize.models.Stage as typeof Stage;
}

export default Stage;
