import {StyleSheet, Text, View} from "react-native";
import React from "react";

export default function CampoPerfil({ label, valor }) {

    return (
        <View style={styles.campo}>

            <Text style={styles.label}>
                {label}
            </Text>

            <Text style={styles.valor}>
                {valor}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    campo: {
        width: "100%",

        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    label: {
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        color: "#888888",

        marginBottom: 4,
    },

    valor: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#333333",

        lineHeight: 20,
    },

})
