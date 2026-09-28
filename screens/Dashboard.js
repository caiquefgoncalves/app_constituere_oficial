import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import CardDashboard from "../components/CardDashboard";
import { logout } from "../services/realizarLogin";

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

    async function sair() {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }]
                        });
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.main}>
                <View style={styles.saudacao}>
                    <Text style={styles.ola}>Olá, </Text>
                    <Text style={styles.nome}>
                        {nome || "Cliente"}
                    </Text>
                </View>
                <View style={styles.resumo}>
                    <Text style={styles.titulo}>Resumo</Text>
                    <View style={styles.cards}>
                        <CardDashboard
                            texto={"Processos Ativos"}
                            numero={"0"}
                            icone={require("../assets/processosAtivos.png")}
                        />
                        <CardDashboard
                            texto={"Próximas Reuniões"}
                            numero={"0"}
                            icone={require("../assets/proximasReunioes.png")}
                        />
                        <CardDashboard
                            texto={"Processos"}
                            numero={"0"}
                            icone={require("../assets/processos.png")}
                        />
                        <CardDashboard
                            texto={"Avisos"}
                            numero={"0"}
                            icone={require("../assets/notificacoesAmarelo.png")}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.botaoSair}
                    onPress={sair}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoBotaoSair}>
                        Sair da conta
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        paddingVertical: 50,
        paddingHorizontal: 30,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: 30,
    },
    saudacao: {
        flexDirection: "row",
    },

    ola: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
    },

    nome: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#0047AB",
    },
    resumo: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        boxShadow: "5px 10px 2px 0px rgba(0, 0, 0, 0.08)",
        flexDirection: "column",
        gap: 16,
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
    botaoSair: {
        marginTop: 10,
        alignSelf: "stretch",
        backgroundColor: "#d9534f",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    textoBotaoSair: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
        fontSize: 16,
    },
});