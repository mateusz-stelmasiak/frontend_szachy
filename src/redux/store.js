import {createLogger} from "redux-logger/src";
import socketMiddleware from "./socketMiddleware";

export default function configureStore(socketClient) {
    const loggerMiddleware = createLogger();
    const middleware = [
        socketMiddleware(socketClient),
    ];
}