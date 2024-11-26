import { Application } from 'express';
import http from 'http';

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

    public securityMiddleware(app: Application): void {};
    public standardMiddleware(app: Application): void {};
    public routesMiddleware(app: Application): void {};
    public globalErrorHandler(app: Application): void {};
    public startServer(app: Application): void {};
    public createSocketID(httpServer: http.Server): void {};
    public startHttpServer(app: http.Server): void {};
}