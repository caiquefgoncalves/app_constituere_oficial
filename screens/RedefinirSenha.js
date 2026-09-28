import React, { useState } from "react";
import { LinearGradient } from 'expo-linear-gradient';

import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Image, ImageBackground, KeyboardAvoidingView, ScrollView
} from "react-native";
import Botao from "../components/Botao";
import Input from "../components/Input";


export default function RedefinirSenha({ navigation }) {

    const [confirmarSenha, setconfirmarSenha] = useState("");
    const [senha, setSenha] = useState("");

    const entrar = () => {
        console.log("Senha:", senha);

        navigation.navigate("Dashboard");

    };

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
                    <Text style={styles.titulo}>Redefinir senha</Text>
                    <Text style={styles.texto}>Para sua segurança, altere sua senha para uma personalizada e única</Text>
                </View>

                <View style={styles.main}>

                    <Input label={"Senha:"} tipo={"numeric"} valor={senha} setValor={setSenha} senha={true}/>

                    <Input label={"Confirmar senha:"} tipo={"numeric"} valor={confirmarSenha} setValor={setconfirmarSenha} senha={true}/>

                    <View style={styles.areaBotao}>
                        <Botao
                            texto="Redefinir sua senha"
                            acao={entrar}
                        />
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