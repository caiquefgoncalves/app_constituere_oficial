import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../services/api";

const SocketContext = createContext(null);

export function SocketProvider({ children, idUsuario }) {
    const socketRef = useRef(null);
    const [conectado, setConectado] = useState(false);
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        if (!idUsuario) return;

        const socket = io(API_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 20,
            reconnectionDelay: 2000,
            autoConnect: true
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("[SOCKET] conectado:", socket.id);
            setConectado(true);
            socket.emit("entrar_usuario", { id_usuario: idUsuario });
        });

        socket.on("entrou_sala", (data) => {
            console.log("[SOCKET] entrou_sala:", data);
        });

        socket.on("disconnect", (motivo) => {
            console.log("[SOCKET] desconectado:", motivo);
            setConectado(false);
        });

        socket.on("connect_error", (err) => {
            console.log("[SOCKET] erro de conexão:", err.message);
        });

        socket.on("nova_notificacao", (notif) => {
            console.log("[SOCKET] nova_notificacao:", notif);
            pushEvento({ tipo: "notificacao", payload: notif });
        });

        socket.on("atualizar_dados", (evt) => {
            console.log("[SOCKET] atualizar_dados:", evt);
            pushEvento({ tipo: "refresh", payload: evt });
        });

        return () => {
            if (idUsuario) {
                socket.emit("sair_usuario", { id_usuario: idUsuario });
            }
            socket.disconnect();
            socketRef.current = null;
        };
    }, [idUsuario]);

    function pushEvento(evt) {
        setEventos((prev) => [...prev, { ...evt, _ts: Date.now() }]);
    }

    return (
        <SocketContext.Provider value={{ conectado, eventos }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) return { conectado: false, eventos: [] };
    return ctx;
}