import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function CardReuniao({ dashboard = "", titulo, dia, horario, local, status, acao, id = 0}) {

    const Realizada = status === "Realizada";
    const AConfirmar = status === "A confirmar";

    const corStatus = Realizada ? "#59A83B" : AConfirmar ? "#E67E22" : "#0757B9";
    const fundoStatus = Realizada ? "#E1F5D9" : AConfirmar ? "#FFF3E0" : "#D4E7FF";
    const iconeStatus = Realizada ? "checkmark-circle-outline" : AConfirmar ? "help-circle-outline" : "time-outline";

    return (
        <TouchableOpacity style={styles.cardReuniao} onPress={acao}>

            <View style={styles.linhaPrincipal}>
                <View style={[styles.iconeFixo, { backgroundColor: Realizada ? "#E9F8E4" : AConfirmar ? "#FFF3E0" : "#E5F0FF" }]}>
                    <Ionicons name={iconeStatus} size={35} color={corStatus} />
                </View>

                <View style={styles.textos}>
                    {dashboard !== "" && <Text style={styles.dashboard}>{dashboard}</Text>}
                    <Text style={styles.nomeReuniao}>{titulo}</Text>
                </View>
            </View>

            <View style={styles.informacao}>
                <Ionicons name="calendar-outline" size={21} color="#0757B9" />
                <Text style={styles.textoInformacao}>{dia}</Text>
            </View>

            <View style={styles.informacao}>
                <Ionicons name="time-outline" size={21} color="#0757B9" />
                <Text style={styles.textoInformacao}>{horario}</Text>
            </View>

            <View style={styles.baixo}>

                <View style={styles.informacao}>
                    <Ionicons name="location-outline" size={22} color="#0757B9" />
                    <Text style={styles.textoInformacao}>{local}</Text>
                </View>

                <View style={styles.areaStatus}>
                    <View style={[styles.statusBase, { backgroundColor: fundoStatus, borderColor: corStatus }]}>
                        <Text style={[styles.textoBase, { color: corStatus }]}>
                            {status}
                        </Text>
                    </View>
                </View>

            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardReuniao: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 18,
        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    linhaPrincipal: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    iconeFixo: {
        width: 45,
        height: 45,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    nomeReuniao: {
        fontSize: 20,
        color: "#222222",
        fontFamily: "Inter_700Bold",
    },
    informacao: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    textoInformacao: {
        fontSize: 14,
        color: "#666666",
        marginLeft: 10,
        fontFamily: "Inter_400Regular",
    },
    areaStatus: {
        marginTop: 4,
        alignItems: "flex-start",
    },
    statusBase: {
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },
    textoBase: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
    },
    dashboard: {
        fontSize: 12,
        color: "#2f7fdf",
        fontFamily: "Inter_700Bold",
    },
    textos: {
        justifyContent: "space-between",
    },

    baixo: {
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "flex-start",
    }
});
