import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import Header from "../components/Header";
import Botao from "../components/Botao";
import CardReuniao from "../components/CardReuniao";

export default function Reunioes({ navigation }) {

    const [filtro, setFiltro] = useState("proximas");

    return (
        <View style={styles.container}>

            <Header navigation={navigation} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >

                {/* CABEÇALHO */}
                <View>
                    <Text style={styles.titulo}>
                        Reuniões
                    </Text>

                    <Text style={styles.subtitulo}>
                        Acompanhe e gerencie suas reuniões
                    </Text>
                </View>


                {/* SUAS REUNIÕES */}

                <Botao texto={"Agendar reunião"}/>



                {/* ABAS */}
                <View style={styles.abas}>

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

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("aConfirmar")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "aConfirmar" && styles.abaAtiva
                            ]}
                        >
                            A Confirmar
                        </Text>

                        {filtro === "aConfirmar" && (
                            <View style={styles.linhaAtiva} />
                        )}
                    </TouchableOpacity>


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


                {filtro === "proximas" && (

                    <View style={styles.listaReunioes}>

                        <CardReuniao
                            titulo={"Andamento do Processo"}
                            dia={"03/08/2026 (Segunda-feira)"}
                            horario={"14:30"}
                            local={"Escritório"}
                            status={"Confirmada"}
                        />

                    </View>

                )}

                { filtro === "aConfirmar" && (
                    <CardReuniao
                        titulo={"Reunião com advogado"}
                        dia={"03/08/2026 (Segunda-feira)"}
                        horario={"14:30"}
                        local={"Escritório"}
                        status={"A confirmar"}

                    />
                )}


                {filtro === "realizadas" && (

                    <View style={styles.listaReunioes}>

                        <CardReuniao
                            titulo={"Consulta Inicial"}
                            dia={"03/08/2026 (Segunda-feira)"}
                            horario={"14:30"}
                            local={"Escritório"}
                            status={"Realizada"}
                        />

                    </View>

                )}

            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        gap: 20,
        paddingBottom: 120,
    },



    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000",
    },

    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3,
    },



    cardTopo: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,

        paddingVertical: 18,
        paddingHorizontal: 18,

        gap: 16,

        elevation: 3,

        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    textosCardTopo: {
        gap: 4,
    },

    tituloSuasReunioes: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
        color: "#000000",
    },

    descricaoSuasReunioes: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
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



    listaReunioes: {
        width: "100%",
        gap: 12,
    },

});