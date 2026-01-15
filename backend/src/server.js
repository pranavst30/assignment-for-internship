require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log('==================================================');
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
            console.log(`Server listening on port ${PORT}`);
            console.log(`Health Check: http://localhost:${PORT}/health`);
            console.log('==================================================');
        });

        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION! Shutting down...');
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        process.on('uncaughtException', (err) => {
            console.error('UNCAUGHT EXCEPTION! Shutting down...');
            console.error(err.name, err.message);
            process.exit(1);
        });

        process.on('SIGTERM', () => {
            console.log('SIGTERM RECEIVED. Shutting down gracefully');
            server.close(() => {
                console.log('Process terminated!');
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
