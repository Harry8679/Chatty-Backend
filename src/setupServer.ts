import { Application, json, urlencoded } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import compression from 'compression';

const SERVER_PORT = 5000;

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
            keys: ['test1', 'test2'],
            maxAge: 24 * 7 * 60 * 60 * 1000
        }));
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: '*',
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

    public routesMiddleware(app: Application): void {};
    public globalErrorHandler(app: Application): void {};
    public startServer(app: Application): void {
        try {
            const httpServer: http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
        } catch(error) {
            console.log(error);
        }
    };
    public createSocketID(httpServer: http.Server): void {};
    public startHttpServer(app: http.Server): void {
        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on the port ${SERVER_PORT}`);
        })
    };
}