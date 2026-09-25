import app from './app';
import { config } from './config';

const PORT = config.port;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Issue Tracker Server running on http://localhost:${PORT}`);
      console.log(`🌐 Environment: ${config.env}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
