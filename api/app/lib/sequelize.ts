import { Sequelize } from "sequelize";

let _sequelize: Sequelize | null = null;

export default function getSequelize(): Sequelize {
  if (!_sequelize) {
    _sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./stages.sqlite", // local DB file inside container
      logging: false,
    });
  }
  return _sequelize;
}
