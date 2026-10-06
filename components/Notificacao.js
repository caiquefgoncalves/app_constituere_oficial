import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Notificacao({
                                        id,
                                        titulo,
                                        mensagem,
                                        tempo,
                                        cor,
                                        nome,
                                        corFundo
                                    }) {
    return (
        <View style={styles.card}>
            <View style={[styles.icone, { backgroundColor: corFundo }]}>
                <Ionicons name={nome} size={26} color={cor} />
            </View>

            <View style={styles.textos}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.mensagem} numberOfLines={3}>
                    {mensagem}
                </Text>
                {tempo ? <Text style={styles.tempo}>{tempo}</Text> : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 14,
        gap: 12,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    icone: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center"
    },
    textos: {
        flex: 1,
        gap: 4
    },
    titulo: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#222222"
    },
    mensagem: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        lineHeight: 18
    },
    tempo: {
        fontSize: 11,
        fontFamily: "Inter_400Regular",
        color: "#999999",
        marginTop: 4
    }
});