import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import CardProcesso from "../components/CardProcesso";
import { buscarProcessos } from "../services/clienteServices";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

function formatarStatus(status) {
    const mapa = {
        'em_andamento': 'Em andamento',
        'concluido': 'Concluído',
        'inativo': 'Inativo'
    };
    return mapa[(status || '').toLowerCase()] || status || "--";
}

export default function Processos({ navigation }) {
    const [processos, setProcessos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const carregar = useCallback(async () => {
        setCarregando(true);

        const resultado = await buscarProcessos();

        if (resultado.sucesso) {
            setProcessos(resultado.processos);
        }

        setCarregando(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    useAutoRefresh(carregar, ["processo", "notificacao"]);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.titulo}>Processos</Text>
                    <Text style={styles.subtitulo}>
                        Acompanhe seus processos e seus principais detalhes
                    </Text>
                </View>

                {carregando ? (
                    <ActivityIndicator size="large" color="#0047AB" />
                ) : processos.length === 0 ? (
                    <Text style={styles.vazio}>Nenhum processo encontrado.</Text>
                ) : (
                    <View style={styles.lista}>
                        {processos.map((item) => (
                            <CardProcesso
                                key={item.id}
                                status={formatarStatus(item.status)}
                                numero={item.numero || "--"}
                                advogados={item.advogado_responsavel || "--"}
                                tipo={item.tipo_processo || item.area || "--"}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        gap: 20
    },
    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000"
    },
    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3
    },
    lista: { width: "100%", gap: 15 },
    vazio: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#888888",
        textAlign: "center",
        marginTop: 20
    }
});