import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function CardDashboard({ texto, acao, icone, numero }) {
    return (
        <TouchableOpacity style={styles.card} onPress={acao}>
            <View style={styles.topo}>
                <Image style={styles.icone} source={icone} />
                <Text style={styles.texto}>{texto}</Text>
            </View>
            <Text style={styles.numero}>{numero}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: "white",
        padding: 12,
        width: "48%",
        gap: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    texto: {
        color: '#696969',
        fontSize: 16,
        textAlign: 'left',
        fontFamily: 'Inter_800ExtraBold',
        maxWidth: "70%"
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
        fontSize: 25,
        fontFamily: 'Inter_800ExtraBold',
    }
});
