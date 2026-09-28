import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    TouchableOpacity
} from "react-native";

import Botao from "../components/Botao";
import { login, logout } from "../services/realizarLogin.js";

function apenasNumeros(texto) {
    return String(texto || '').replace(/\D/g, '');
}

function mascararCpf(valor) {
    const n = apenasNumeros(valor).slice(0, 11);

    if (n.length <= 3) return n;
    if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
    if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;

    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

export default function Login({ navigation }) {

    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function entrar() {
        if (carregando) return;

        console.log('[LOGIN] Tentando entrar com CPF:', cpf);

        setCarregando(true);

        const resultado = await login(cpf, senha);

        console.log('[LOGIN] Resultado:', resultado);

        setCarregando(false);

        if (!resultado.sucesso) {
            Alert.alert(
                'Não foi possível entrar',
                resultado.mensagem || 'Erro desconhecido.'
            );
            return;
        }

        navigation.navigate("Dashboard");
    }

    async function sairDaContaAtual() {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair da conta que está logada?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        Alert.alert('Pronto', 'Você saiu da conta.');
                    }
                }
            ]
        );
    }

    function aoDigitarCpf(texto) {
        setCpf(mascararCpf(texto));
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../assets/logoMaior.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.titulo}>Entre na sua conta!</Text>
                <Text style={styles.texto}>
                    Consulte seu login e senha com seu advogado
                </Text>
            </View>

            <View style={styles.main}>

                <Text style={styles.label}>
                    CPF
                </Text>

                <TextInput
                    style={styles.input}
                    value={cpf}
                    onChangeText={aoDigitarCpf}
                    keyboardType="numeric"
                    autoCapitalize="none"
                    placeholder="000.000.000-00"
                    placeholderTextColor="#999999"
                    maxLength={14}
                    editable={!carregando}
                />

                <Text style={styles.labelSenha}>
                    Senha
                </Text>

                <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={true}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#999999"
                    editable={!carregando}
                />

                <View style={styles.areaBotao}>
                    {carregando ? (
                        <ActivityIndicator size="large" color="#0047ab" />
                    ) : (
                        <Botao
                            texto="Entrar"
                            acao={entrar}
                        />
                    )}
                </View>

                <TouchableOpacity
                    style={styles.botaoSair}
                    onPress={sairDaContaAtual}
                    activeOpacity={0.7}
                    disabled={carregando}
                >
                    <Text style={styles.textoBotaoSair}>
                        Sair da conta logada
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        flex: 2,
        backgroundColor: "#1E1E1E",
        paddingHorizontal: 40,
        paddingVertical: 70,
        flexDirection: "column",
    },

    main: {
        flex: 3,
        padding: 70,
    },

    logo: {
        width: 200,
        height: 75,
    },

    titulo: {
        paddingLeft: 10,
        color: "#FFFFFF",
        fontSize: 45,
        fontFamily: "Inter_700Bold",
        width: "80%",
        paddingTop: 80,
        marginBottom: 10,
    },

    texto: {
        paddingLeft: 10,
        color: "#FFFFFF",
        fontFamily: "Inter_400Regular_Italic",
        fontSize: 18,
    },

    label: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 10,
        fontFamily: "Inter_700Bold",
    },

    labelSenha: {
        fontSize: 17,
        fontFamily: "Inter_700Bold",
        fontWeight: "bold",
        marginTop: 30,
        marginBottom: 10,
    },

    input: {
        width: "100%",
        height: 44,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#000000",
        borderColor: "#0047ab",
        borderWidth: 1,
    },

    areaBotao: {
        alignItems: "center",
        marginTop: 45,
    },

    botaoSair: {
        marginTop: 25,
        alignSelf: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },

    textoBotaoSair: {
        color: "#d32f2f",
        fontFamily: "Inter_700Bold",
        fontSize: 14,
        textDecorationLine: "underline",
    },

});