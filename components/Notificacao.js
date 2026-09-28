import {StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function Notificacao({id, titulo, mensagem, tempo, nome, cor, corFundo}) {
    return (
        <View
            key={id}
            style={styles.card}
        >


            <View
                style={[
                    styles.areaIcone,
                    {
                        backgroundColor: corFundo
                    }
                ]}
            >

                <Ionicons
                    name={nome}
                    size={35}
                    color={cor}
                />

            </View>


            <View style={styles.conteudoCard}>

                <View style={styles.topoCard}>

                    <Text style={styles.tituloNotificacao}>
                        {titulo}
                    </Text>


                </View>


                <Text style={styles.mensagem}>
                    {mensagem}
                </Text>


                <Text style={styles.tempo}>
                    {tempo}
                </Text>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({

    card: {
        width: "100%",

        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        padding: 15,

        flexDirection: "row",
        alignItems: "center",

        elevation: 2,

        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },


    areaIcone: {
        width: 45,
        height: 45,

        borderRadius: 10,

        alignItems: "center",
        justifyContent: "center",

        marginRight: 12,
    },


    conteudoCard: {
        flex: 1,
        marginRight: 8,
    },

    topoCard: {
        flexDirection: "row",
        alignItems: "center",
    },

    tituloNotificacao: {
        flex: 1,

        fontSize: 16,
        fontFamily: "Inter_700Bold",

        color: "#222222",
    },

    mensagem: {
        fontSize: 14,
        lineHeight: 19,

        fontFamily: "Inter_400Regular",

        color: "#666666",

        marginTop: 5,
    },

    tempo: {
        fontSize: 11,

        fontFamily: "Inter_400Regular",

        color: "#999999",

        marginTop: 7,
    },
})