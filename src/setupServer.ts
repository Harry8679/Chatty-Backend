import { Application } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';

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
    };
    public standardMiddleware(app: Application): void {};
    public routesMiddleware(app: Application): void {};
    public globalErrorHandler(app: Application): void {};
    public startServer(app: Application): void {};
    public createSocketID(httpServer: http.Server): void {};
    public startHttpServer(app: http.Server): void {};
}