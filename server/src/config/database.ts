import { Sequelize } from 'sequelize';
import { config } from './index';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.env === 'development' ? false : false, // Clean console output
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL database connected successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL database:', error);
    return false;
  }
};
