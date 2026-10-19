
import {StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";

import {
    mascaraCPF,
    mascaraCNPJ,
    mascaraCPFouCNPJ,
    mascaraRG,
    mascaraCEP,
    mascaraTelefone,
    dataParaTela
} from "../utils/mascaras";

function mascaraPeloLabel(label) {
    const l = (label || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (l.includes("cpf") && l.includes("cnpj")) return mascaraCPFouCNPJ;
    if (l.includes("cnpj")) return mascaraCNPJ;
    if (l.includes("cpf")) return mascaraCPF;
    if (/\brg\b/.test(l)) return mascaraRG;
    if (/\bcep\b/.test(l)) return mascaraCEP;
    if (/telefone|celular|whatsapp|\bfone\b/.test(l)) return mascaraTelefone;
    if (/\bdata\b|nascimento/.test(l)) return dataParaTela;

    return null;
}


export default function Input({
                                  label,
                                  valor,
                                  setValor,
                                  tipo = "default",
                                  letraMaiuscula = "none",
                                  senha = false,
                                  mascara
                              }) {
    let aplicar = null;

    if (!senha && mascara !== false) {
        aplicar = typeof mascara === "function" ? mascara : mascaraPeloLabel(label);
    }

    function aoDigitar(texto) {
        setValor(aplicar ? aplicar(texto) : texto);
    }

    const valorMostrado = aplicar ? aplicar(valor || "") : valor;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                style={styles.input}
                value={valorMostrado}
                onChangeText={aoDigitar}
                keyboardType={tipo}
                autoCapitalize={letraMaiuscula}
                secureTextEntry={senha}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },

    label: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: "Inter_700Bold",
    },

    input: {
        width: "100%",
        height: 44,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 14,
        color: "#000000",
        borderColor: "#0047ab",
        borderWidth: 1,
    },
})