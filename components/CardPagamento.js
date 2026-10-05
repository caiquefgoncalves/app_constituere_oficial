import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Botao from "./Botao";
import React from "react";

export default function CardPagamento({ dashboard = "", status = "pago", titulo, valor, data, acao, navigation }) {

    const Vencido = status === "vencido";
    const Aberto = status === "aberto";
    const Pago = status === "pagos" || status === "pago";

    const corStatus = Vencido ? "#FF4D55" : Aberto ? "#E6B000" : "#59A83B";
    const fundoIcone = Vencido ? "#FFE9EA" : Aberto ? "#FFF9E6" : "#EBF6E9";
    const nomeIcone = Pago ? "checkmark-done-outline" : "document-outline";

    return (
        <TouchableOpacity style={styles.cardPagamento} onPress={acao}>

            <View style={styles.topoCard}>

                <View style={[styles.icone, { backgroundColor: fundoIcone }]}>
                    <Ionicons
                        name={nomeIcone}
                        size={35}
                        color={corStatus}
                    />
                </View>

                <View>
                    {dashboard !== "" && (
                        <Text style={[styles.dashboard, { color: corStatus }]}>
                            {dashboard}
                        </Text>
                    )}

                    <Text style={styles.honorario}>
                        {titulo}
                    </Text>

                    <Text style={[styles.valorBase, { color: corStatus }]}>
                        {valor}
                    </Text>
                </View>

            </View>

            <View style={styles.informacoes}>

                <View style={styles.blocoInformacao}>
                    <View style={styles.infoTitulo}>
                        <Ionicons
                            name="calendar-outline"
                            size={19}
                            color="#0757B9"
                        />
                        <Text style={styles.infoTexto}>
                            {Pago ? "Pago em" : "Vencimento"}
                        </Text>
                    </View>

                    <Text style={styles.infoValor}>
                        {data}
                    </Text>
                </View>

                <View style={styles.blocoInformacao}>
                    {Pago ? (
                        <View style={styles.statusPago}>
                            <Text style={{ color: corStatus, fontFamily: "Inter_700Bold", fontSize: 14 }}>
                                ✓ Concluído
                            </Text>
                        </View>
                    ) : (
                        <Botao texto={"Pagar agora"} menor={true} acao={() => navigation.navigate("RealizarPagamento")} />
                    )}
                </View>

            </View>

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardPagamento: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 18,
        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    topoCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 24,
    },
    icone: {
        width: 45,
        height: 45,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    honorario: {
        fontSize: 20,
        fontFamily: "Inter_700Bold",
        color: "#222222",
    },
    informacoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        marginBottom: 18,
        alignItems: "center",
    },
    blocoInformacao: {
        minWidth: 120,
    },
    infoTitulo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 6,
    },
    infoTexto: {
        fontSize: 14,
        color: "#999999",
    },
    infoValor: {
        fontSize: 16,
        color: "#333333",
        fontFamily: "Inter_700Bold",
    },
    valorBase: {
        fontSize: 20,
        fontFamily: "Inter_700Bold",
    },
    dashboard: {
        fontSize: 12,
        fontFamily: "Inter_700Bold",
    },
    statusPago: {
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EBF6E9",
    }
});
