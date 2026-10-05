import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

export default function Select({
                    label,
                    valor,
                    setValor,
                    opcoes,
                    grande = false
                }) {

    const [aberto, setAberto] = useState(false);


    function selecionar(opcao) {

        setValor(opcao);

        setAberto(false);

    }


    return (

        <View style={styles.selectContainer}>


            <Text style={styles.labelSelect}>
                {label}
            </Text>


            <TouchableOpacity
                style={[
                    styles.select,

                    aberto &&
                    styles.selectAberto
                ]}
                onPress={() =>
                    setAberto(!aberto)
                }
            >

                <Text
                    style={[
                        styles.valorSelect,

                        valor === "" &&
                        styles.placeholderSelect
                    ]}
                >
                    {
                        valor === ""
                            ? "Selecione"
                            : valor
                    }
                </Text>


                <Ionicons
                    name={
                        aberto
                            ? "chevron-up-outline"
                            : "chevron-down-outline"
                    }
                    size={20}
                    color="#0047AB"
                />

            </TouchableOpacity>



            {aberto && (

                <View
                    style={[
                        styles.opcoesSelect,

                        grande &&
                        styles.opcoesSelectGrande
                    ]}
                >

                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                    >

                        {opcoes.map((opcao) => (

                            <TouchableOpacity
                                key={opcao}
                                style={[
                                    styles.opcaoSelect,

                                    valor === opcao &&
                                    styles.opcaoSelecionada
                                ]}
                                onPress={() =>
                                    selecionar(opcao)
                                }
                            >


                                <Text
                                    style={[
                                        styles.textoOpcao,

                                        valor === opcao &&
                                        styles.textoOpcaoSelecionada
                                    ]}
                                >
                                    {opcao}
                                </Text>


                                {valor === opcao && (

                                    <Ionicons
                                        name="checkmark-outline"
                                        size={19}
                                        color="#0047AB"
                                    />

                                )}


                            </TouchableOpacity>

                        ))}

                    </ScrollView>

                </View>

            )}


        </View>

    );
}

const styles = StyleSheet.create({
    selectContainer: {
        width: "100%",
    },


    labelSelect: {
        fontSize: 14,

        marginBottom: 10,

        fontFamily: "Inter_700Bold",

        color: "#000000",
    },


    select: {
        width: "100%",
        height: 44,

        backgroundColor: "#FFFFFF",

        borderRadius: 8,

        paddingHorizontal: 12,

        borderWidth: 1,
        borderColor: "#0047AB",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },


    selectAberto: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },


    valorSelect: {
        flex: 1,

        fontSize: 14,
        fontFamily: "Inter_400Regular",

        color: "#000000",
    },


    placeholderSelect: {
        color: "#999999",
    },


    opcoesSelect: {
        width: "100%",

        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "#0047AB",

        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,

        overflow: "hidden",
    },


    opcoesSelectGrande: {
        maxHeight: 220,
    },


    opcaoSelect: {
        minHeight: 44,

        paddingHorizontal: 12,
        paddingVertical: 10,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },


    opcaoSelecionada: {
        backgroundColor: "#EEF5FF",
    },


    textoOpcao: {
        flex: 1,

        fontSize: 14,
        fontFamily: "Inter_400Regular",

        color: "#333333",
    },


    textoOpcaoSelecionada: {
        fontFamily: "Inter_700Bold",
        color: "#0047AB",
    },


})
