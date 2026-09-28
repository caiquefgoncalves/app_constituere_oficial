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
        borderWidth: 1,
        borderColor: "#0047AB",
        padding: 12,
        width: "49%",
        gap: 7,
        alignItems: "center",
        marginBottom: 10
    },
    texto: {
        color: '#696969',
        fontSize: 18,
        textAlign: 'left',
        marginBottom: 2,
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
        width: 40,
        height: 40,
    },

    numero: {
        fontSize: 35,
        fontFamily: 'Inter_800ExtraBold',
    }
});
