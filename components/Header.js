import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { buscarNotificacoes } from "../services/clienteServices";

export default function Header({ navigation }) {
    const [naoLidas, setNaoLidas] = useState(0);

    const carregarContador = useCallback(async () => {
        const resultado = await buscarNotificacoes();

        if (resultado.sucesso) {
            const total = resultado.notificacoes.filter(
                (n) => n.lida === false
            ).length;

            setNaoLidas(total);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarContador();
        }, [carregarContador])
    );

    useAutoRefresh(carregarContador, ["notificacao", "todas"]);

    function irParaDashboard() {
        if (!navigation) return;

        // Verifica se "Dashboard" existe no navigator atual
        const state = navigation.getState();

        const nomes = state.routeNames || [];

        if (nomes.includes("Dashboard")) {
            // Estamos dentro do Tab Navigator → navega direto
            navigation.navigate("Dashboard");
            return;
        }

        // Estamos fora (ex: tela de Notificações) → vai pro Stack raiz → Principal (Tab) → Dashboard
        navigation.navigate("Principal", { screen: "Dashboard" });
    }

    function abrirNotificacoes() {
        if (!navigation) return;

        const state = navigation.getState();

        const nomes = state.routeNames || [];

        if (nomes.includes("Notificacoes")) {
            navigation.navigate("Notificacoes");
            return;
        }

        // Se estivermos dentro do Tab, sobe pro parent pra achar "Notificacoes"
        const parent = navigation.getParent();

        if (parent) {
            parent.navigate("Notificacoes");
        }
    }

    const sair = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("nome");
        await AsyncStorage.removeItem("id_usuario");

        if (navigation) {
            navigation.replace("Login");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={irParaDashboard}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/logoMaior.png')}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.acoesDireita}>
                    <TouchableOpacity
                        style={styles.botaoNotificacao}
                        onPress={abrirNotificacoes}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={35}
                            color="white"
                        />

                        {naoLidas > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeTexto}>
                                    {naoLidas > 99 ? "99+" : naoLidas}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botaoSair}
                        onPress={sair}
                    >
                        <Ionicons
                            name="log-out-outline"
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 140,
        backgroundColor: "#2A2929",
        width: "100%",
        paddingHorizontal: 30,
        justifyContent: "flex-end",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 15
    },
    logo: {
        width: 160,
        height: 60,
    },
    acoesDireita: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    botaoNotificacao: {
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    botaoSair: {
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -6,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#FF4D55",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: "#2A2929",
    },
    badgeTexto: {
        color: "#FFFFFF",
        fontSize: 11,
        fontFamily: "Inter_700Bold",
        lineHeight: 13,
    },
});