/**
 * Entry point for the application
 * @type {Server}
 * @author Dennis Zyska
 */

const Server = require("./server");
if (process.env.APP_ENV !== 'production') {
    const server = new Server('http://127.0.0.1:' + process.env.PUBLIC_DB_PORT);
    server.start(process.env.PUBLIC_PORT);
} else {
    const server = new Server('http://db:8529');
    server.start(process.env.PUBLIC_PORT);
}
