import express, { Application } from 'express';
import userRoutes from '../routes/users.routes';
import cors from 'cors';
import db from '../db/connection';

class Server {
	private app: Application;
	private port: string;
	private apiPaths = {
		users: '/api/users',
	};
	constructor() {
		this.app = express();
		this.port = process.env.PORT || '8000';

		// Conecting to the Database
		this.dbConnection();

		// Applying the middlewares
		this.middlewares();

		// Defining the routes
		this.routes();
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('Server in port' + this.port);
		});
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Reading body of the request
		this.app.use(express.json());

		// Public folder
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.apiPaths.users, userRoutes);
	}

	// Database connection
	async dbConnection() {
		try {
			await db.authenticate();
			console.log('Database onLine');
		} catch (error: any) {
			throw new Error(error);
		}
	}
}

export default Server;
