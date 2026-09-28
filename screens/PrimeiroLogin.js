import React, { useState } from "react";

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

import AsyncStorage from "@react-native-async-storage/async-storage";
import Botao from "../components/Botao";
import Input from "../components/Input";
import { requisicao } from "../services/api";

function senhaForte(senha) {
    if (!senha || senha.length < 8) return false;
    if (!/[A-Z]/.test(senha)) return false;
    if (!/[a-z]/.test(senha)) return false;
    if (!/[0-9]/.test(senha)) return false;
    if (!/[^A-Za-z0-9]/.test(senha)) return false;
    return true;
}

export default function PrimeiroLogin({ navigation }) {

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function redefinir() {
        if (carregando) return;

        if (!senha || !confirmarSenha) {
            Alert.alert("Atenção", "Preencha os dois campos de senha.");
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert("Atenção", "As senhas não correspondem.");
            return;
        }

        if (!senhaForte(senha)) {
            Alert.alert(
                "Senha fraca",
                "A senha precisa ter:\n\n" +
                "• Pelo menos 8 caracteres\n" +
                "• Uma letra maiúscula\n" +
                "• Uma letra minúscula\n" +
                "• Um número\n" +
                "• Um caractere especial (ex: !@#$%)"
            );
            return;
        }

        const token = await AsyncStorage.getItem("token");

        if (!token) {
            Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
            navigation.navigate("Login");
            return;
        }

        setCarregando(true);

        try {
            const { ok, dados } = await requisicao("/redefinir_senha", {
                method: "PUT",
                headers: {
                    "X-Access-Token": token
                },
                body: JSON.stringify({
                    senha,
                    confirmar_senha: confirmarSenha
                })
            });

            setCarregando(false);

            if (!ok) {
                Alert.alert(
                    "Não foi possível redefinir",
                    dados.error || "Tente novamente."
                );
                return;
            }

            await AsyncStorage.setItem("precisa_redefinir_senha", "false");

            Alert.alert("Pronto", "Sua senha foi redefinida com sucesso.");

            navigation.navigate("Dashboard");

        } catch (erro) {
            setCarregando(false);
            console.log("[PRIMEIRO_LOGIN] Erro:", erro);
            Alert.alert("Erro", "Não foi possível conectar ao servidor.");
        }
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
                    <Text style={styles.titulo}>Vamos te ajudar a começar!</Text>
                    <Text style={styles.texto}>
                        Para sua segurança, altere sua senha para uma personalizada e única
                    </Text>
                </View>

                <View style={styles.main}>

                    <Input
                        label={"Senha:"}
                        tipo={"default"}
                        valor={senha}
                        setValor={setSenha}
                        senha={true}
                    />

                    <Input
                        label={"Confirmar senha:"}
                        tipo={"default"}
                        valor={confirmarSenha}
                        setValor={setConfirmarSenha}
                        senha={true}
                    />

                    <View style={styles.areaBotao}>
                        {carregando ? (
                            <ActivityIndicator size="large" color="#0047ab" />
                        ) : (
                            <Botao
                                texto="Redefinir sua senha"
                                acao={redefinir}
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
        width: "90%",
        paddingTop: 50,
        marginBottom: 10,
    },

    texto: {
        paddingLeft: 10,
        color: "#FFFFFF",
        fontFamily: "Inter_400Regular_Italic",
        fontSize: 16,
        width: "90%",
    },

    areaBotao: {
        alignItems: "center",
        marginTop: 20,
    },

});