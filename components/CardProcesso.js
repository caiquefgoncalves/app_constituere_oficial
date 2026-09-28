import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function CardProcesso({id, tipo, numero, advogados, status}) {
    return (
        <View
            key={id}
            style={styles.cardProcesso}
        >


            <View style={styles.topoCard}>

                <View style={styles.iconeProcesso}>

                    <Ionicons
                        name="document-text-outline"
                        size={35}
                        color="#0047AB"
                    />

                </View>


                <View style={styles.tituloProcesso}>

                    <Text style={styles.tipoTopo}>
                        {tipo}
                    </Text>

                    <Text style={styles.numeroTopo}>
                        Processo Nº {numero}
                    </Text>

                </View>

            </View>



            <View style={styles.statusArea}>

                <View style={styles.informacao}>

                    <View style={styles.tituloInformacao}>

                        <Ionicons
                            name="people-outline"
                            size={21}
                            color="#0047AB"
                        />

                        <Text style={styles.label}>
                            Advogados
                        </Text>

                    </View>

                    <Text style={styles.valor}>
                        {advogados}
                    </Text>

                </View>


                <View
                    style={[
                        styles.status,

                        status === "Em andamento"
                            ? styles.statusAndamento

                            : status === "Aguardando"
                                ? styles.statusAguardando

                                : styles.statusConcluido
                    ]}
                >

                    <Text
                        style={[
                            styles.textoStatus,

                            status === "Em andamento"
                                ? styles.textoAndamento

                                : status === "Aguardando"
                                    ? styles.textoAguardando

                                    : styles.textoConcluido
                        ]}
                    >
                        {status}
                    </Text>

                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    cardProcesso: {
        width: "100%",

        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        padding: 18,

        elevation: 3,

        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },

        gap: 16,
    },


    topoCard: {
        flexDirection: "row",
        alignItems: "center",

        paddingBottom: 14,

        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    iconeProcesso: {
        width: 45,
        height: 45,

        borderRadius: 8,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 12,
    },

    tituloProcesso: {
        flex: 1,
    },

    tipoTopo: {
        fontSize: 17,
        fontFamily: "Inter_700Bold",
        color: "#222222",
    },

    numeroTopo: {
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        color: "#888888",
        marginTop: 3,
    },


    informacao: {
        width: "60%",
    },

    tituloInformacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,

        marginBottom: 5,
    },

    label: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#444444",
    },

    valor: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",

        marginLeft: 25,
        lineHeight: 20,
    },

    descricao: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",

        marginLeft: 25,
        lineHeight: 20,
    },


    statusArea: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingTop: 2,
    },

    status: {
        borderRadius: 20,

        paddingVertical: 5,
        paddingHorizontal: 12,

        borderWidth: 1,
    },



    statusAndamento: {
        backgroundColor: "#FFF6D9",
        borderColor: "#E6B000",
    },

    textoAndamento: {
        color: "#C59600",
    },



    statusConcluido: {
        backgroundColor: "#E9F8E4",
        borderColor: "#59A83B",
    },

    textoConcluido: {
        color: "#59A83B",
    },


    textoStatus: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
    },

})