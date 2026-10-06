import { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import CardDashboard from "../components/CardDashboard";
import CardReuniao from "../components/CardReuniao";
import CardPagamento from "../components/CardPagamento";
import { buscarDashboard, buscarMeusDados } from "../services/clienteServices";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

function formatarNome(nomeCompleto) {
    if (!nomeCompleto) return "";

    const partes = String(nomeCompleto)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (partes.length === 0) return "";
    if (partes.length === 1) return partes[0];

    return `${partes[0]} ${partes[partes.length - 1]}`;
}

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export default function Dashboard({ navigation }) {
    const [nome, setNome] = useState("");
    const [carregando, setCarregando] = useState(true);

    const [totalProcessos, setTotalProcessos] = useState(0);
    const [totalReunioes, setTotalReunioes] = useState(0);
    const [proximaReuniao, setProximaReuniao] = useState(null);
    const [pagamentoPendente, setPagamentoPendente] = useState(null);

    const carregar = useCallback(async () => {
        try {
            let nomeFinal = null;

            try {
                const meusDados = await buscarMeusDados();

                if (meusDados.sucesso && meusDados.usuario?.nome) {
                    nomeFinal = meusDados.usuario.nome;

                    try {
                        await AsyncStorage.setItem("nome", nomeFinal);
                    } catch (e) {
                        console.log("[DASHBOARD] Erro ao salvar nome local:", e);
                    }
                }
            } catch (e) {
                console.log("[DASHBOARD] Erro /meus_dados:", e);
            }

            if (!nomeFinal) {
                try {
                    const nomeSalvo = await AsyncStorage.getItem("nome");
                    if (nomeSalvo) nomeFinal = nomeSalvo;
                } catch (e) {
                    console.log("[DASHBOARD] Erro AsyncStorage:", e);
                }
            }

            if (nomeFinal) {
                setNome(formatarNome(nomeFinal));
            }

            const resultado = await buscarDashboard();

            if (resultado.sucesso) {
                setTotalProcessos(resultado.dados.processos_ativos || 0);
                setTotalReunioes(resultado.dados.proximas_reunioes || 0);
                setProximaReuniao(resultado.dados.proxima_reuniao || null);
                setPagamentoPendente(resultado.dados.pagamento_pendente || null);
            }
        } catch (erro) {
            console.log("[DASHBOARD] Erro:", erro);
        } finally {
            setCarregando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    useAutoRefresh(carregar, [
        "agendamento",
        "processo",
        "notificacao",
        "usuario"
    ]);

    if (carregando) {
        return (
            <View style={styles.container}>
                <Header navigation={navigation} />
                <View style={styles.carregandoBox}>
                    <ActivityIndicator size="large" color="#0047AB" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View style={styles.saudacao}>
                        <Text style={styles.ola}>Olá, </Text>
                        <Text style={styles.nome}>{nome || "Cliente"}</Text>
                    </View>
                    <Text style={styles.subtitulo}>
                        Tenha uma visão geral dos seus processos e reuniões
                    </Text>
                </View>

                <View style={styles.cards}>
                    <CardDashboard
                        texto={"Processos Ativos"}
                        numero={String(totalProcessos)}
                        icone={require("../assets/iconeProcessoAtivo.png")}
                    />
                    <CardDashboard
                        texto={"Próximas Reuniões"}
                        numero={String(totalReunioes)}
                        icone={require("../assets/iconeReunioesAtivo.png")}
                        acao={() => navigation.navigate("Reunioes")}
                    />
                </View>

                <View style={styles.resumo}>
                    <Text style={styles.titulo}>O que você precisa saber</Text>

                    <CardReuniao
                        titulo={proximaReuniao?.assunto || "Nenhuma reunião agendada"}
                        dia={proximaReuniao?.data_formatada || "--"}
                        horario={proximaReuniao?.horario || "--"}
                        local={proximaReuniao?.local || "--"}
                        status={proximaReuniao?.status || "--"}
                        dashboard={"Próxima Reunião"}
                        acao={() => navigation.navigate("Reunioes")}
                    />

                    <CardPagamento
                        titulo={pagamentoPendente?.nome || "Nenhum pagamento pendente"}
                        dashboard={"Pagamento Pendente"}
                        status={pagamentoPendente ? "aberto" : "fechado"}
                        valor={formatarDinheiro(pagamentoPendente?.valor || 0)}
                        data={pagamentoPendente?.vencimento || "--"}
                        acao={() => navigation.navigate("Pagamentos")}
                        navigation={navigation}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    carregandoBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        alignItems: "flex-start",
        gap: 20
    },
    saudacao: { flexDirection: "row" },
    ola: { fontSize: 25, fontFamily: "Inter_700Bold" },
    nome: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    },
    titulo: { fontSize: 20, fontFamily: "Inter_800ExtraBold" },
    cards: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    resumo: { width: "100%", gap: 10 },
    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3
    }
});