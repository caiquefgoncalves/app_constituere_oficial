import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import Notificacao from "../components/Notificacao";
import {
    buscarNotificacoes,
    marcarNotificacoesLidas
} from "../services/clienteServices";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

function tipoPorNotificacao(notif) {
    const tipo = notif.tipo || '';

    if (
        tipo === 'NOVO_AGENDAMENTO' ||
        tipo === 'AGENDAMENTO_CONFIRMADO_ADVOGADO' ||
        tipo === 'AGENDAMENTO_CANCELADO' ||
        tipo === 'AGENDAMENTO_DESMARCADO_ADVOGADO' ||
        tipo === 'AGENDAMENTO_RECUSADO_ADVOGADO' ||
        tipo === 'AGENDAMENTO_REAGENDADO'
    ) {
        return 'reuniao';
    }

    return 'pagamento';
}

function corPorNotificacao(notif) {
    const tipo = notif.tipo || '';

    if (
        tipo.includes('CANCELADO') ||
        tipo.includes('RECUSADO') ||
        tipo.includes('DESMARCADO')
    ) {
        return { cor: '#FF4D55', fundo: '#FFE9EA', icone: 'close-circle-outline' };
    }

    if (tipo.includes('CONFIRMADO') || tipo.includes('ADICIONADO')) {
        return { cor: '#59A83B', fundo: '#E9F8E4', icone: 'checkmark-circle-outline' };
    }

    return { cor: '#0047AB', fundo: '#EEF5FF', icone: 'information-circle-outline' };
}

export default function Notificacoes({ navigation }) {
    const [filtro, setFiltro] = useState("todas");
    const [notificacoes, setNotificacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const carregar = useCallback(async () => {
        setCarregando(true);

        const resultado = await buscarNotificacoes();

        if (resultado.sucesso) {
            setNotificacoes(resultado.notificacoes);

            // Marca todas como lidas no backend depois de exibir
            await marcarNotificacoesLidas();
        }

        setCarregando(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    useAutoRefresh(carregar, ["notificacao", "todas"]);

    const filtradas = notificacoes.filter((item) => {
        if (filtro === 'todas') return true;
        return tipoPorNotificacao(item) === filtro;
    });

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cabecalho}>
                    <Text style={styles.titulo}>Notificações</Text>
                </View>

                <View style={styles.abas}>
                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("todas")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "todas" && styles.abaAtiva
                            ]}
                        >
                            Todas
                        </Text>
                        {filtro === "todas" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("reuniao")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "reuniao" && styles.abaAtiva
                            ]}
                        >
                            Reuniões
                        </Text>
                        {filtro === "reuniao" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("pagamento")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "pagamento" && styles.abaAtiva
                            ]}
                        >
                            Pagamentos
                        </Text>
                        {filtro === "pagamento" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>
                </View>

                {carregando ? (
                    <ActivityIndicator size="large" color="#0047AB" />
                ) : filtradas.length === 0 ? (
                    <Text style={styles.vazio}>
                        Nenhuma notificação encontrada.
                    </Text>
                ) : (
                    <View style={styles.lista}>
                        {filtradas.map((item) => {
                            const visual = corPorNotificacao(item);

                            return (
                                <Notificacao
                                    key={item.id}
                                    id={item.id}
                                    titulo={item.titulo}
                                    mensagem={item.mensagem}
                                    tempo={item.data_criacao || ""}
                                    cor={visual.cor}
                                    nome={visual.icone}
                                    corFundo={visual.fundo}
                                />
                            );
                        })}
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
    cabecalho: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between"
    },
    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000"
    },
    abas: {
        width: "100%",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E2E2"
    },
    aba: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 10,
        position: "relative"
    },
    textoAba: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#999999"
    },
    abaAtiva: { color: "#0047AB" },
    linhaAtiva: {
        position: "absolute",
        bottom: -1,
        width: "70%",
        height: 3,
        backgroundColor: "#0047AB",
        borderRadius: 3
    },
    lista: { width: "100%", gap: 12 },
    vazio: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#888888",
        textAlign: "center",
        marginTop: 20
    }
});