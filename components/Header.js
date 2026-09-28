import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function Header({ navigation }) {

    const lidarComSair = () => {
        if (navigation) {
            navigation.replace("Login");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logoMaior.png')}
                    resizeMode="contain"
                />

                <View style={styles.acoesDireita}>

                    <TouchableOpacity style={styles.botaoNotificacao} onPress={() => navigation.navigate("Notificacoes")}>
                        <Ionicons
                            name="notifications-outline"
                            size={35}
                            color="white"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botaoSair}
                        onPress={lidarComSair}
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
    },
    botaoSair: {
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
    },
});