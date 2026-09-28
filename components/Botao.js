import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Botao({ texto, acao, cor = 'azul' }) {
    return (
        <TouchableOpacity style={[styles.botao, styles[`botao${cor}`]]} onPress={acao}>
            <Text style={[styles.texto, styles[`texto${cor}`]]}>{texto}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    botao: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoazul: {
        backgroundColor: '#0047AB'
    },
    texto: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 2,
        fontFamily: 'Inter_700Bold',
    }
});
