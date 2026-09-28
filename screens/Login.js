import React, { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    ActivityIndicator
} from "react-native";

import Botao from "../components/Botao";
import Input from "../components/Input";
import { login } from "../services/realizarLogin";

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

    const [cpfCnpj, setCpfCnpj] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function entrar() {
        if (carregando) return;

        console.log("CPF/CNPJ:", cpfCnpj);
        console.log("Senha:", senha);

        setCarregando(true);

        const resultado = await login(cpfCnpj, senha);

        console.log("[LOGIN] Resultado:", resultado);

        setCarregando(false);

        if (!resultado.sucesso) {
            Alert.alert(
                'Não foi possível entrar',
                resultado.mensagem || 'Erro desconhecido.'
            );
            return;
        }

        if (resultado.precisaRedefinirSenha) {
            navigation.navigate("PrimeiroLogin");
            return;
        }

        navigation.navigate("Dashboard");
    }

    function aoDigitarCpf(texto) {
        setCpfCnpj(mascararCpf(texto));
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior="height">
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
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

                    <Input
                        label={"CPF/CNPJ:"}
                        tipo={"numeric"}
                        valor={cpfCnpj}
                        setValor={aoDigitarCpf}
                    />

                    <Input
                        label={"Senha:"}
                        tipo={"default"}
                        valor={senha}
                        setValor={setSenha}
                        senha={true}
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
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        backgroundColor: "#1E1E1E",
        paddingHorizontal: 40,
        paddingVertical: 70,
        flexDirection: "column",
    },

    main: {
        padding: 70,
        gap: 15
    },

    scrollContainer: {
        flexGrow: 1,
    },

    logo: {
        width: 200,
        height: 75,
    },

    titulo: {
        paddingLeft: 10,
        color: "#FFFFFF",
        fontSize: 35,
        fontFamily: "Inter_700Bold",
        width: "80%",
        paddingTop: 50,
        marginBottom: 10,
    },

    texto: {
        paddingLeft: 10,
        color: "#FFFFFF",
        fontFamily: "Inter_400Regular_Italic",
        fontSize: 16,
    },

    areaBotao: {
        alignItems: "center",
        marginTop: 20,
    },

});