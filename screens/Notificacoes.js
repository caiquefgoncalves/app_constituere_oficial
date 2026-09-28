import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Notificacao from "../components/Notificacao";


export default function Notificacoes({ navigation }) {

    const [filtro, setFiltro] = useState("todas");

    const [notificacoes, setNotificacoes] = useState([

        {
            id: 1,
            tipo: "reuniao",
            status: "confirmada",
            titulo: "Reunião confirmada",
            mensagem: "Sua reunião com Dr. Carlos Mendes foi confirmada para 03/08/2026 às 14:30.",
            tempo: "Há 10 minutos",
        },

        {
            id: 2,
            tipo: "pagamento",
            status: "proximo",
            titulo: "Pagamento próximo",
            mensagem: "Você possui um pagamento de R$ 1.000,00 com vencimento em 02/10/2026.",
            tempo: "Há 2 horas",
        },

        {
            id: 3,
            tipo: "reuniao",
            status: "cancelada",
            titulo: "Reunião cancelada",
            mensagem: "A reunião sobre Andamento do Processo, marcada para 30/07/2026, foi cancelada.",
            tempo: "Ontem",
        },

        {
            id: 4,
            tipo: "pagamento",
            status: "pago",
            titulo: "Pagamento realizado",
            mensagem: "O pagamento de R$ 850,00 foi registrado com sucesso.",
            tempo: "25/07/2026",
        }

    ]);


    function pegarCor(item) {

        if (item.status === "confirmada") {
            return "#59A83B";
        }

        if (item.status === "cancelada") {
            return "#FF4D55";
        }

        if (item.status === "proximo") {
            return "#E6B000";
        }

        return "#59A83B";
    }


    function pegarFundo(item) {

        if (item.status === "confirmada") {
            return "#E9F8E4";
        }

        if (item.status === "cancelada") {
            return "#FFE9EA";
        }

        if (item.status === "proximo") {
            return "#FFF6D9";
        }

        return "#E9F8E4";
    }


    function pegarIcone(item) {

        if (item.status === "confirmada") {
            return "calendar-outline";
        }

        if (item.status === "cancelada") {
            return "close-circle-outline";
        }

        if (item.status === "proximo") {
            return "wallet-outline";
        }

        return "checkmark-circle-outline";
    }


    return (
        <View style={styles.container}>

            <Header navigation={navigation} />


            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >


                <View style={styles.cabecalho}>

                    <View style={styles.textosCabecalho}>

                        <Text style={styles.titulo}>
                            Notificações
                        </Text>

                    </View>

                </View>

                <View style={styles.abas}>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("todas")}
                    >

                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "todas" &&
                                styles.abaAtiva
                            ]}
                        >
                            Todas
                        </Text>

                        {filtro === "todas" && (
                            <View style={styles.linhaAtiva} />
                        )}

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("reuniao")}
                    >

                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "reuniao" &&
                                styles.abaAtiva
                            ]}
                        >
                            Reuniões
                        </Text>

                        {filtro === "reuniao" && (
                            <View style={styles.linhaAtiva} />
                        )}

                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("pagamento")}
                    >

                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "pagamento" &&
                                styles.abaAtiva
                            ]}
                        >
                            Pagamentos
                        </Text>

                        {filtro === "pagamento" && (
                            <View style={styles.linhaAtiva} />
                        )}

                    </TouchableOpacity>

                </View>



                <View style={styles.lista}>

                    {notificacoes
                        .filter((item) =>
                            filtro === "todas" ||
                            item.tipo === filtro
                        )
                        .map((item) => (
                            <Notificacao
                                id={item.id}
                                titulo={item.titulo}
                                mensagem={item.mensagem}
                                tempo={item.tempo}
                                cor={pegarCor(item)}
                                nome={pegarIcone(item)}
                                corFundo={pegarFundo(item)}
                            />

                        ))}

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
        paddingBottom: 120,
        gap: 20,
    },



    cabecalho: {
        width: "100%",

        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },

    textosCabecalho: {
        flex: 1,
    },

    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000",
    },


    abas: {
        width: "100%",

        flexDirection: "row",

        borderBottomWidth: 1,
        borderBottomColor: "#E2E2E2",
    },

    aba: {
        flex: 1,
        alignItems: "center",

        paddingBottom: 10,

        position: "relative",
    },

    textoAba: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#999999",
    },

    abaAtiva: {
        color: "#0047AB",
    },

    linhaAtiva: {
        position: "absolute",

        bottom: -1,

        width: "70%",
        height: 3,

        backgroundColor: "#0047AB",

        borderRadius: 3,
    },



    lista: {
        width: "100%",
        gap: 12,
    },

});