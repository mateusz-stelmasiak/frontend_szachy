import SocketClient from "../serverLogic/WebSocket";
import {createContext} from 'react';

export const socket = new SocketClient();
export const SocketContext = createContext(socket);