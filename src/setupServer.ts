import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import compression from 'compression';
import { config } from './config';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import applicationRoutes from './routes';
import { CustomError, IErrorResponse } from './shared/globals/helpers/error-handler';

const SERVER_PORT = 5050;

export class ChattyServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    };

    public securityMiddleware(app: Application): void {
        app.use(cookieSession({
            name: 'session',
            keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
            maxAge: 24 * 7 * 60 * 60 * 1000,
            secure: config.NODE_ENV !== 'development'
        }));
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            // origin: '*',
            origin: config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }));
    };
    public standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ extended: true, limit: '50mb' }));
    };

    public routesMiddleware(app: Application): void {
        applicationRoutes(app);
    };
    public globalErrorHandler(app: Application): void {
        app.all('*', (req: Request, res: Response) => {
            res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
        });
    
        app.use(((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
            console.log(error);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json(error.serializeErrors());
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error'
            });
        }) as (err: any, req: Request, res: Response, next: NextFunction) => void);
    }
    
    public async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app);
            // const socketIO: Server = await this.createSocketIO(httpServer);
            const socketIO: Server = await this.createSocketIO(httpServer);

            this.startHttpServer(httpServer);
            this.socketIOConnections(socketIO);
        } catch(error) {
            console.log(error);
        }
    };

    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        console.log(`Connecting to Redis using URL: ${config.REDIS_HOST}`);
    
        const io: Server = new Server(httpServer, {
            cors: {
                origin: config.CLIENT_URL,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            }
        });
    
        try {
            const pubClient = createClient({ url: config.REDIS_HOST });
            const subClient = pubClient.duplicate();
            await Promise.all([pubClient.connect(), subClient.connect()]);
            io.adapter(createAdapter(pubClient, subClient));
            return io;
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            throw error;
        }
    }
    

    public startHttpServer(app: http.Server): void {
        console.log(`Server has started with process ${process.pid}`);
        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on the port ${SERVER_PORT}`);
        })
    };

    private socketIOConnections(io: Server): void {};
}