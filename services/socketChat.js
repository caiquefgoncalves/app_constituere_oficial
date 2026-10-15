import { io } from 'socket.io-client';
import { API_URL } from './api';

export function criarSocketChat(token) {
    const socket = io(API_URL, {
        transports: ['polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        autoConnect: true
    });

    socket.on('connect', () => {
        socket.emit('authenticate', { token });
    });

    return socket;
}