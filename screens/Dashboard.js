import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import CardDashboard from "../components/CardDashboard";
import CardReuniao from "../components/CardReuniao";
import CardPagamento from "../components/CardPagamento";

function formatarNome(nomeCompleto) {
    if (!nomeCompleto) return "";

    const partes = String(nomeCompleto)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (partes.length === 0) return "";
    if (partes.length === 1) return partes[0];

    const primeiro = partes[0];
    const ultimo = partes[partes.length - 1];

    return `${primeiro} ${ultimo}`;
}

export default function Dashboard({ navigation }) {
    const [nome, setNome] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarNome() {
            try {
                const nomeSalvo = await AsyncStorage.getItem("nome");

                if (ativo && nomeSalvo) {
                    setNome(formatarNome(nomeSalvo));
                }
            } catch (erro) {
                console.log("[DASHBOARD] Erro ao carregar nome:", erro);
            }
        }

        carregarNome();

        return () => {
            ativo = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={styles.main}>
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
                        numero={"3"}
                        icone={require("../assets/iconeProcessoAtivo.png")}
                    />
                    <CardDashboard
                        texto={"Próximas Reuniões"}
                        numero={"1"}
                        icone={require("../assets/iconeReunioesAtivo.png")}
                    />
                </View>
                <View style={styles.resumo}>
                    <Text style={styles.titulo}>O que você precisa saber</Text>
                    <CardReuniao
                        titulo={"Andamento do Processo"}
                        dia={"03/08/2026 (Segunda-feira)"}
                        horario={"14:30"}
                        local={"Escritório"}
                        status={"A confirmar"}
                        dashboard={"Próxima Reunião"}
                    />
                    <CardPagamento
                        titulo={"Pagamento do Processo"}
                        dashboard={"Pagamento Pendente"}
                        status={"aberto"}
                        valor={"R$ 1.000,00"}
                        data={"02/10/2026"}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 20,
    },
    saudacao: {
        flexDirection: "row",
    },

    ola: {
        fontSize: 25,
        fontFamily: "Inter_700Bold"
    },

    nome: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    },
    titulo: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
    },
    cards: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },

    resumo: {
        width: "100%",
        gap: 10
    },
    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3,
    }
})