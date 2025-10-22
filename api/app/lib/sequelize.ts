import { Sequelize } from "sequelize";

let _sequelize: Sequelize | null = null;

export default function getSequelize(): Sequelize {
  if (!_sequelize) {
    _sequelize = new Sequelize({
      dialect: "sqlite",
      // Persist DB under a dedicated folder that is volume-mounted via docker-compose
      storage: "/app/sqlite/stages.sqlite",
      logging: false,
    });
  }
  return _sequelize;
}
