import { Client } from 'pg';
import { config } from '../config';
import { sequelize } from '../models';

export const initializeDatabase = async (force: boolean = false): Promise<void> => {
  console.log(`🔍 Checking database '${config.db.name}'...`);

  // Connect to postgres default DB to check/create target database
  const client = new Client({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.db.name]
    );

    if (res.rowCount === 0) {
      console.log(`🛠️ Database '${config.db.name}' not found. Creating database...`);
      await client.query(`CREATE DATABASE "${config.db.name}"`);
      console.log(`✅ Database '${config.db.name}' created successfully.`);
    } else {
      console.log(`✅ Database '${config.db.name}' exists.`);
    }
  } catch (err: any) {
    console.warn(`⚠️ Warning checking/creating database: ${err.message}`);
  } finally {
    await client.end().catch(() => {});
  }

  // Connect and sync Sequelize models
  try {
    await sequelize.authenticate();
    console.log('🔄 Syncing Sequelize models...');
    await sequelize.sync({ force });
    console.log(`✅ Schema synchronized successfully (force=${force}).`);
  } catch (error) {
    console.error('❌ Failed to synchronize database schema:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  const isForce = process.argv.includes('--force');
  initializeDatabase(isForce)
    .then(async () => {
      await sequelize.close().catch(() => {});
      console.log('🎉 Database initialization complete.');
      process.exit(0);
    })
    .catch(async (err) => {
      await sequelize.close().catch(() => {});
      console.error('❌ Database initialization error:', err);
      process.exit(1);
    });
}
