import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function CardValores({ titulo, valor, quantidade}) {
    const Vencido = titulo === "Vencido";
    const Aberto = titulo === "Em aberto";
    const Pago = titulo === "Pago" || titulo === "Pago";

    const corStatus = Vencido ? "#FF4D55" : Aberto ? "#E6B000" : "#59A83B";

    return (
        <View style={styles.card}>
            <Text style={[styles.texto, { color: corStatus }]}>{titulo}</Text>
            <Text style={styles.numero}>R$ {valor}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: "white",
        padding: 12,
        width: 180,
        gap: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    texto: {
        color: '#696969',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Inter_800ExtraBold',
        maxWidth: "90%"
    },

    topo: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        gap: 10
    },

    icone: {
        width: 30,
        height: 30,
    },

    numero: {
        fontSize: 20,
        fontFamily: 'Inter_800ExtraBold',
    }
});
