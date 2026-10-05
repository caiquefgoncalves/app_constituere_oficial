import {StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";

export default function Input({label, valor, setValor, tipo = "default", letraMaiuscula = "none", senha = false}) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput
                style={styles.input}
                value={valor}
                onChangeText={setValor}
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