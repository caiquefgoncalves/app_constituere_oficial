import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import Botao from "../components/Botao";

export default function Reunioes({ setTela }) {

    const [filtro, setFiltro] = useState("proximas");

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.conteudo}>
                <ScrollView
            >

                {/* TÍTULO */}
                <Text style={styles.titulo}>

                </Text>


                {/* CARD SUAS REUNIÕES */}
                <View style={styles.cardTopo}>

                    <Text style={styles.tituloSuasReunioes}>
                        Suas Reuniões
                    </Text>

                    <Botao texto={"Agendar reunião"} />

                </View>


                {/* FILTRO */}
                <View style={styles.abas}>

                    {/* PRÓXIMAS */}
                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("proximas")}
                    >

                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "proximas" && styles.abaAtiva
                            ]}
                        >
                            Próximas
                        </Text>

                        {filtro === "proximas" && (
                            <View style={styles.linhaAtiva} />
                        )}

                    </TouchableOpacity>


                    {/* REALIZADAS */}
                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("realizadas")}
                    >

                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "realizadas" && styles.abaAtiva
                            ]}
                        >
                            Realizadas
                        </Text>

                        {filtro === "realizadas" && (
                            <View style={styles.linhaAtiva} />
                        )}

                    </TouchableOpacity>

                </View>


                {/* ========================================= */}
                {/* PRÓXIMAS */}
                {/* ========================================= */}

                {filtro === "proximas" && (

                    <View style={styles.cardReuniao}>

                        {/* TÍTULO DA REUNIÃO */}
                        <View style={styles.linhaPrincipal}>

                            <View style={styles.iconeRelogio}>

                                <Ionicons
                                    name="time-outline"
                                    size={30}
                                    color="#0757B9"
                                />

                            </View>

                            <Text style={styles.nomeReuniao}>
                                Andamento do Processo
                            </Text>

                        </View>


                        {/* DATA */}
                        <View style={styles.informacao}>

                            <Ionicons
                                name="calendar-outline"
                                size={21}
                                color="#0757B9"
                            />

                            <Text style={styles.textoInformacao}>
                                03/08/2026 (Segunda-Feira)
                            </Text>

                        </View>


                        {/* HORÁRIO */}
                        <View style={styles.informacao}>

                            <Ionicons
                                name="time-outline"
                                size={21}
                                color="#0757B9"
                            />

                            <Text style={styles.textoInformacao}>
                                14:30
                            </Text>

                        </View>


                        {/* LOCAL */}
                        <View style={styles.informacao}>

                            <Ionicons
                                name="location-outline"
                                size={22}
                                color="#0757B9"
                            />

                            <Text style={styles.textoInformacao}>
                                Escritório
                            </Text>

                        </View>


                        {/* STATUS */}
                        <View style={styles.areaStatus}>

                            <View style={styles.statusConfirmada}>

                                <Text style={styles.textoConfirmada}>
                                    Confirmada
                                </Text>

                            </View>

                        </View>

                    </View>

                )}


                {/* ========================================= */}
                {/* REALIZADAS */}
                {/* ========================================= */}

                {filtro === "realizadas" && (

                    <View style={styles.cardReuniao}>

                        {/* TÍTULO DA REUNIÃO */}
                        <View style={styles.linhaPrincipal}>

                            <View style={styles.iconeRealizada}>

                                <Ionicons
                                    name="checkmark-outline"
                                    size={30}
                                    color="#59A83B"
                                />

                            </View>

                            <Text style={styles.nomeReuniao}>
                                Consulta Inicial
                            </Text>

                        </View>


                        {/* DATA */}
                        <View style={styles.informacao}>

                            <Ionicons
                                name="calendar-outline"
                                size={21}
                                color="#0757B9"
                            />

                            <Text style={styles.textoInformacao}>
                                03/08/2026 (Segunda-Feira)
                            </Text>

                        </View>


                        {/* HORÁRIO */}
                        <View style={styles.informacao}>

                            <Ionicons
                                name="time-outline"
                                size={21}
                                color="#0757B9"
                            />

                            <Text style={styles.textoInformacao}>
                                14:30
                            </Text>

                        </View>


                        {/* LOCAL */}
                        <View style={styles.informacao}>

                            <Ionicons
                                name="location-outline"
                                size={22}
                                color="#0757B9"
                            />

                            <Text style={styles.textoInformacao}>
                                Escritório
                            </Text>

                        </View>


                        {/* STATUS */}
                        <View style={styles.areaStatus}>

                            <View style={styles.statusRealizada}>

                                <Text style={styles.textoRealizada}>
                                    Realizada
                                </Text>

                            </View>

                        </View>

                    </View>

                )}

            </ScrollView>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },



    conteudo: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 110,
    },


    /* TÍTULO */

    titulo: {
        fontSize: 25,
        fontWeight: "800",
        color: "#2A2929",
        marginBottom: 15,
    },


    /* CARD SUPERIOR */

    cardTopo: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        elevation: 5,

        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 6,

        shadowOffset: {
            width: 0,
            height: 3,
        },

        marginBottom: 23,
    },


    tituloSuasReunioes: {
        fontSize: 25,
        fontWeight: "800",
        fontFamily: "Inter_400Regular",
        color: "#222222",
    },




    textoAgendar: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },


    /* ABAS */

    abas: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
        marginBottom: 23,
    },


    aba: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 10,
    },


    textoAba: {
        fontSize: 18,
        fontFamily: "Inter_700Bold",
        color: "#AAAAAA",
    },


    abaAtiva: {
        color: "#0757B9",
    },


    linhaAtiva: {
        position: "absolute",
        bottom: -1,
        width: "75%",
        height: 3,
        backgroundColor: "#0757B9",
        borderRadius: 3,
    },


    /* CARD DA REUNIÃO */

    cardReuniao: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 18,

        elevation: 5,

        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 6,

        shadowOffset: {
            width: 0,
            height: 3,
        },

        marginBottom: 20,
    },


    /* TÍTULO DO CARD */

    linhaPrincipal: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },


    iconeRelogio: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: "#E5F0FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },


    iconeRealizada: {
        width: 40,
        height: 40,
        borderRadius: 6,
        backgroundColor: "#E9F8E4",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },


    nomeReuniao: {
        fontSize: 20,
        color: "#222222",
        fontFamily: "Inter_700Bold",
    },


    /* INFORMAÇÕES */

    informacao: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 13,
    },


    textoInformacao: {
        fontSize: 15,
        color: "#666666",
        marginLeft: 10,
        fontFamily: "Inter_400Regular",
    },


    /* STATUS */

    areaStatus: {
        marginTop: 4,
        alignItems: "flex-start",
    },


    statusConfirmada: {
        backgroundColor: "#D4E7FF",
        borderWidth: 1,
        borderColor: "#0757B9",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },


    textoConfirmada: {
        color: "#0757B9",
        fontSize: 15,
        fontFamily: "Inter_700Bold",
    },


    statusRealizada: {
        backgroundColor: "#E1F5D9",
        borderWidth: 1,
        borderColor: "#59A83B",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 12,
    },


    textoRealizada: {
        color: "#59A83B",
        fontSize: 15,
        fontFamily: "Inter_700Bold",
    },

});