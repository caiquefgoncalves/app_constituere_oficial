import React from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Botao from "../components/Botao";


export default function Perfil({ navigation }) {

    const fotoPerfil = null;

    return (
        <View style={styles.container}>

            <Header navigation={navigation} />

            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >


                <View>

                    <Text style={styles.titulo}>
                        Perfil
                    </Text>

                    <Text style={styles.subtitulo}>
                        Consulte e gerencie seus dados pessoais
                    </Text>

                </View>


                <View style={styles.cardPerfil}>

                    <View style={styles.areaFoto}>
                        <View style={styles.fotoPadrao}>

                            <Ionicons
                                name="person-outline"
                                size={45}
                                color="#0047AB"
                            />

                        </View>


                    </View>


                    <View style={styles.infoPrincipal}>

                        <Text style={styles.nome}>
                            Nome Completo
                        </Text>

                        <Text style={styles.emailPrincipal}>
                            email@email.com
                        </Text>

                    </View>

                </View>



                <Botao
                    texto={"Editar perfil"}
                    acao={() =>
                        navigation.navigate("EditarPerfil")
                    }
                />


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

                        <CampoPerfil
                            label={"Nome Completo"}
                            valor={"Nome Completo do Cliente"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Data de nascimento"}
                            valor={"01/01/2000"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"CPF"}
                            valor={"000.000.000-00"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Sexo"}
                            valor={"Feminino"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"RG"}
                            valor={"00.000.000-0"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Órgão expedidor"}
                            valor={"SSP/SP"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Nacionalidade"}
                            valor={"Brasileira"}
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

                        <CampoPerfil
                            label={"Número da carteira de trabalho"}
                            valor={"0000000"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Série da carteira de trabalho"}
                            valor={"0000"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Profissão"}
                            valor={"Analista"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Áreas de atuação"}
                            valor={"Tecnologia, Dados e Gestão"}
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

                        <CampoPerfil
                            label={"CEP"}
                            valor={"00000-000"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Logradouro"}
                            valor={"Rua Exemplo"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Número"}
                            valor={"123"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Complemento"}
                            valor={"Apartamento 10"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Bairro"}
                            valor={"Centro"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Cidade"}
                            valor={"Birigui"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Estado"}
                            valor={"São Paulo"}
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

                        <CampoPerfil
                            label={"Telefone"}
                            valor={"(00) 00000-0000"}
                        />

                        <View style={styles.divisoria} />


                        <CampoPerfil
                            label={"Email"}
                            valor={"email@email.com"}
                        />

                    </View>

                </View>


                <View style={styles.secao}>

                    <View style={styles.tituloSecaoArea}>

                        <View style={styles.iconeSecao}>

                            <Ionicons
                                name="shield-checkmark-outline"
                                size={21}
                                color="#0047AB"
                            />

                        </View>

                        <Text style={styles.tituloSecao}>
                            Segurança
                        </Text>

                    </View>


                    <View style={styles.cardAcoes}>

                        <TouchableOpacity
                            style={styles.acao}
                            onPress={() =>
                                navigation.navigate("RedefinirSenha")
                            }
                        >



                            <View style={styles.textosAcao}>

                                <Text style={styles.tituloAcao}>
                                    Redefinir senha
                                </Text>

                                <Text style={styles.descricaoAcao}>
                                    Altere a senha de acesso à sua conta
                                </Text>

                            </View>


                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color="#999999"
                            />

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

        </View>
    );
}



function CampoPerfil({ label, valor }) {

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

    container: {
        flex: 1,
    },


    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 140,
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



    cardPerfil: {
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

    areaFoto: {
        position: "relative",

        marginRight: 15,
    },

    fotoPerfil: {
        width: 75,
        height: 75,

        borderRadius: 38,
    },

    fotoPadrao: {
        width: 75,
        height: 75,

        borderRadius: 38,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",
    },

    botaoFoto: {
        position: "absolute",

        right: -2,
        bottom: -2,

        width: 28,
        height: 28,

        borderRadius: 14,

        backgroundColor: "#0047AB",

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 2,
        borderColor: "#FFFFFF",
    },

    infoPrincipal: {
        flex: 1,
    },

    nome: {
        fontSize: 18,
        fontFamily: "Inter_700Bold",
        color: "#222222",
    },

    emailPrincipal: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#777777",

        marginTop: 4,
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

        elevation: 2,

        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },



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

    divisoria: {
        height: 1,

        backgroundColor: "#EEEEEE",

        marginHorizontal: 16,
    },



    cardAcoes: {
        width: "100%",

        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        elevation: 2,

        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    acao: {
        width: "100%",

        minHeight: 70,

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 15,
        paddingVertical: 12,
    },

    iconeAcao: {
        width: 42,
        height: 42,

        borderRadius: 8,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 12,
    },

    textosAcao: {
        flex: 1,
    },

    tituloAcao: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#222222",
    },

    descricaoAcao: {
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        color: "#777777",

        marginTop: 3,
    },

});