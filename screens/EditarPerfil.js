import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Input from "../components/Input";
import Botao from "../components/Botao";


export default function EditarPerfil({ navigation }) {


    const [nome, setNome] = useState("Nome Completo do Cliente");
    const [dataNascimento, setDataNascimento] = useState("01/01/2000");
    const [cpf, setCpf] = useState("000.000.000-00");
    const [sexo, setSexo] = useState("Feminino");
    const [rg, setRg] = useState("00.000.000-0");
    const [orgaoExpedidor, setOrgaoExpedidor] = useState("SSP/SP");
    const [nacionalidade, setNacionalidade] = useState("Brasileira");



    const [carteiraTrabalho, setCarteiraTrabalho] = useState("0000000");
    const [serieCarteira, setSerieCarteira] = useState("0000");
    const [profissao, setProfissao] = useState("Analista");
    const [areasAtuacao, setAreasAtuacao] = useState(
        "Tecnologia, Dados e Gestão"
    );


    const [cep, setCep] = useState("00000-000");
    const [logradouro, setLogradouro] = useState("Rua Exemplo");
    const [numero, setNumero] = useState("123");
    const [complemento, setComplemento] = useState("Apartamento 10");
    const [bairro, setBairro] = useState("Centro");
    const [cidade, setCidade] = useState("Birigui");
    const [estado, setEstado] = useState("São Paulo");



    const [telefone, setTelefone] = useState("(00) 00000-0000");
    const [email, setEmail] = useState("email@email.com");


    function salvarPerfil() {

        console.log({
            nome,
            dataNascimento,
            cpf,
            sexo,
            rg,
            orgaoExpedidor,
            carteiraTrabalho,
            serieCarteira,
            profissao,
            areasAtuacao,
            nacionalidade,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            telefone,
            email
        });


        navigation.goBack();
    }



    return (
        <View style={styles.container}>

            <Header navigation={navigation} />


            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : "height"
                }
            >

                <ScrollView
                    contentContainerStyle={styles.main}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >


                    <View>

                        <Text style={styles.titulo}>
                            Editar perfil
                        </Text>

                        <Text style={styles.subtitulo}>
                            Atualize suas informações pessoais
                        </Text>

                    </View>

                    <View style={styles.secao}>

                        <View style={styles.tituloSecaoArea}>

                            <View style={styles.iconeSecao}>

                                <Ionicons
                                    name="person-outline"
                                    size={21}
                                    color="#0047AB"
                                />

                            </View>

                            <Text style={styles.tituloSecao}>
                                Dados pessoais
                            </Text>

                        </View>


                        <View style={styles.card}>

                            <Input
                                label={"Nome Completo"}
                                valor={nome}
                                setValor={setNome}
                                letraMaiuscula={"words"}
                            />


                            <Input
                                label={"Data de nascimento"}
                                valor={dataNascimento}
                                setValor={setDataNascimento}
                                tipo={"numeric"}
                            />


                            <Input
                                label={"CPF"}
                                valor={cpf}
                                setValor={setCpf}
                                tipo={"numeric"}
                            />


                            <Input
                                label={"Sexo"}
                                valor={sexo}
                                setValor={setSexo}
                                letraMaiuscula={"words"}
                            />


                            <Input
                                label={"RG"}
                                valor={rg}
                                setValor={setRg}
                            />


                            <Input
                                label={"Órgão expedidor"}
                                valor={orgaoExpedidor}
                                setValor={setOrgaoExpedidor}
                                letraMaiuscula={"characters"}
                            />


                            <Input
                                label={"Nacionalidade"}
                                valor={nacionalidade}
                                setValor={setNacionalidade}
                                letraMaiuscula={"words"}
                            />

                        </View>

                    </View>

                    <View style={styles.secao}>

                        <View style={styles.tituloSecaoArea}>

                            <View style={styles.iconeSecao}>

                                <Ionicons
                                    name="briefcase-outline"
                                    size={21}
                                    color="#0047AB"
                                />

                            </View>

                            <Text style={styles.tituloSecao}>
                                Dados profissionais
                            </Text>

                        </View>


                        <View style={styles.card}>

                            <Input
                                label={"Número da carteira de trabalho"}
                                valor={carteiraTrabalho}
                                setValor={setCarteiraTrabalho}
                                tipo={"numeric"}
                            />


                            <Input
                                label={"Série da carteira de trabalho"}
                                valor={serieCarteira}
                                setValor={setSerieCarteira}
                                tipo={"numeric"}
                            />


                            <Input
                                label={"Profissão"}
                                valor={profissao}
                                setValor={setProfissao}
                                letraMaiuscula={"words"}
                            />


                            <Input
                                label={"Áreas de atuação"}
                                valor={areasAtuacao}
                                setValor={setAreasAtuacao}
                                letraMaiuscula={"sentences"}
                            />

                        </View>

                    </View>


                    <View style={styles.secao}>

                        <View style={styles.tituloSecaoArea}>

                            <View style={styles.iconeSecao}>

                                <Ionicons
                                    name="location-outline"
                                    size={22}
                                    color="#0047AB"
                                />

                            </View>

                            <Text style={styles.tituloSecao}>
                                Endereço
                            </Text>

                        </View>


                        <View style={styles.card}>

                            <Input
                                label={"CEP"}
                                valor={cep}
                                setValor={setCep}
                                tipo={"numeric"}
                            />


                            <Input
                                label={"Logradouro"}
                                valor={logradouro}
                                setValor={setLogradouro}
                                letraMaiuscula={"words"}
                            />


                            <Input
                                label={"Número"}
                                valor={numero}
                                setValor={setNumero}
                                tipo={"numeric"}
                            />


                            <Input
                                label={"Complemento"}
                                valor={complemento}
                                setValor={setComplemento}
                                letraMaiuscula={"sentences"}
                            />


                            <Input
                                label={"Bairro"}
                                valor={bairro}
                                setValor={setBairro}
                                letraMaiuscula={"words"}
                            />


                            <Input
                                label={"Cidade"}
                                valor={cidade}
                                setValor={setCidade}
                                letraMaiuscula={"words"}
                            />


                            <Input
                                label={"Estado"}
                                valor={estado}
                                setValor={setEstado}
                                letraMaiuscula={"words"}
                            />

                        </View>

                    </View>

                    <View style={styles.secao}>

                        <View style={styles.tituloSecaoArea}>

                            <View style={styles.iconeSecao}>

                                <Ionicons
                                    name="call-outline"
                                    size={21}
                                    color="#0047AB"
                                />

                            </View>

                            <Text style={styles.tituloSecao}>
                                Contato
                            </Text>

                        </View>


                        <View style={styles.card}>

                            <Input
                                label={"Telefone"}
                                valor={telefone}
                                setValor={setTelefone}
                                tipo={"phone-pad"}
                            />


                            <Input
                                label={"Email"}
                                valor={email}
                                setValor={setEmail}
                                tipo={"email-address"}
                            />

                        </View>

                    </View>


                    <View style={styles.botoes}>

                        <Botao
                            texto={"Salvar alterações"}
                            acao={salvarPerfil}
                        />


                        <TouchableOpacity
                            style={styles.cancelar}
                            onPress={() =>
                                navigation.goBack()
                            }
                        >

                            <Text style={styles.textoCancelar}>
                                Cancelar
                            </Text>

                        </TouchableOpacity>

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </View>
    );
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
    },


    keyboard: {
        flex: 1,
    },


    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        gap: 20,
    },


    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000",
    },

    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3,
    },


    cardFoto: {
        width: "100%",

        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        padding: 18,

        flexDirection: "row",
        alignItems: "center",

        elevation: 3,

        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    foto: {
        width: 75,
        height: 75,

        borderRadius: 38,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 15,
    },

    infoFoto: {
        flex: 1,
    },

    tituloFoto: {
        fontSize: 16,
        fontFamily: "Inter_700Bold",
        color: "#222222",
    },

    descricaoFoto: {
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        color: "#777777",

        marginTop: 3,
        marginBottom: 10,
    },

    alterarFoto: {
        alignSelf: "flex-start",

        flexDirection: "row",
        alignItems: "center",

        gap: 6,
    },

    textoAlterarFoto: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#0047AB",
    },


    secao: {
        width: "100%",
        gap: 10,
    },

    tituloSecaoArea: {
        flexDirection: "row",
        alignItems: "center",

        gap: 8,
    },

    iconeSecao: {
        width: 34,
        height: 34,

        borderRadius: 8,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",
    },

    tituloSecao: {
        fontSize: 18,
        fontFamily: "Inter_800ExtraBold",
        color: "#222222",
    },

    card: {
        width: "100%",

        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        padding: 16,

        gap: 18,

        elevation: 2,

        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },


    botoes: {
        width: "100%",
        gap: 8,
    },

    cancelar: {
        width: "100%",
        height: 48,

        alignItems: "center",
        justifyContent: "center",
    },

    textoCancelar: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#0047AB",
    },

});