import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

export function useAutoRefresh(callback, entidades = []) {
    const { eventos } = useSocket();
    const ultimoProcessado = useRef(0);

    useEffect(() => {
        if (eventos.length === 0) return;

        const ultimo = eventos[eventos.length - 1];

        if (!ultimo || ultimo._ts === ultimoProcessado.current) return;

        ultimoProcessado.current = ultimo._ts;

        if (ultimo.tipo === "notificacao") {
            if (entidades.includes("notificacao") || entidades.includes("todas")) {
                callback();
            }
            return;
        }

        if (ultimo.tipo === "refresh") {
            const entidade = ultimo.payload?.entidade;

            if (
                entidades.includes("todas") ||
                entidades.includes(entidade)
            ) {
                callback();
            }
        }
    }, [eventos, callback, entidades]);
}