import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import Botao from "../components/Botao";
import CampoPerfil from "../components/CampoPerfil";
import { buscarMeusDados } from "../services/clienteServices";
import { API_URL } from "../services/api";

function formatarCpf(valor) {
    if (!valor) return "--";
    const n = String(valor).replace(/\D/g, "");
    if (n.length !== 11) return valor;
    return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
}

function formatarTelefone(valor) {
    if (!valor) return "--";
    const n = String(valor).replace(/\D/g, "");
    if (n.length === 11) {
        return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
    }
    if (n.length === 10) {
        return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    }
    return valor;
}

export default function Perfil({ navigation }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [fotoErro, setFotoErro] = useState(false);
    const [versaoFoto, setVersaoFoto] = useState(Date.now());

    const carregar = useCallback(async () => {
        const resultado = await buscarMeusDados();

        if (resultado.sucesso) {
            setUsuario(resultado.usuario);
            setFotoErro(false);
            setVersaoFoto(Date.now());
        }

        setCarregando(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    const juridico = usuario?.tipo === 3;

    const urlFoto = usuario?.id
        ? `${API_URL}/uploads/Usuarios/${usuario.id}.jpeg?v=${versaoFoto}`
        : null;

    const mostrarFoto = urlFoto && !fotoErro;

    if (carregando) {
        return (
            <View style={styles.container}>
                <Header navigation={navigation} />
                <View style={styles.carregandoBox}>
                    <ActivityIndicator size="large" color="#0047AB" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.titulo}>Perfil</Text>
                    <Text style={styles.subtitulo}>
                        Consulte e gerencie seus dados pessoais
                    </Text>
                </View>

                <View style={styles.cardPerfil}>
                    <View style={styles.areaFoto}>
                        <View style={styles.fotoPadrao}>
                            {mostrarFoto ? (
                                <Image
                                    source={{ uri: urlFoto }}
                                    style={styles.foto}
                                    onError={() => setFotoErro(true)}
                                />
                            ) : (
                                <Ionicons
                                    name="person-outline"
                                    size={45}
                                    color="#0047AB"
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.infoPrincipal}>
                        <Text style={styles.nome}>
                            {usuario?.nome || "Cliente"}
                        </Text>
                        <Text style={styles.emailPrincipal}>
                            {usuario?.email || "--"}
                        </Text>
                    </View>
                </View>

                <Botao
                    texto={"Editar perfil"}
                    acao={() =>
                        navigation.navigate("EditarPerfil", {
                            tipoCliente: juridico ? "juridico" : "fisico"
                        })
                    }
                />

                <View style={styles.gap}>
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
                                label={"Nome"}
                                valor={usuario?.nome || "--"}
                            />
                            <View style={styles.divisoria} />

                            <CampoPerfil
                                label={"CPF"}
                                valor={formatarCpf(usuario?.cpf)}
                            />
                            <View style={styles.divisoria} />

                            <CampoPerfil
                                label={"RG"}
                                valor={usuario?.rg || "--"}
                            />
                            <View style={styles.divisoria} />

                            <CampoPerfil
                                label={"Órgão expedidor"}
                                valor={usuario?.orgao_expedidor || "--"}
                            />
                            <View style={styles.divisoria} />

                            <CampoPerfil
                                label={"Nacionalidade"}
                                valor={usuario?.nacionalidade || "--"}
                            />
                            <View style={styles.divisoria} />

                            <CampoPerfil
                                label={"Estado civil"}
                                valor={usuario?.estado_civil || "--"}
                            />
                        </View>
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
                        <Text style={styles.tituloSecao}>Contato</Text>
                    </View>

                    <View style={styles.card}>
                        <CampoPerfil
                            label={"Telefone"}
                            valor={formatarTelefone(usuario?.telefone)}
                        />
                        <View style={styles.divisoria} />

                        <CampoPerfil
                            label={"Email"}
                            valor={usuario?.email || "--"}
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
                        <Text style={styles.tituloSecao}>Segurança</Text>
                    </View>

                    <View style={styles.cardAcoes}>
                        <TouchableOpacity
                            style={styles.acao}
                            onPress={() =>
                                navigation.navigate("RedefinirSenha")
                            }
                        >
                            <View style={styles.iconeAcao}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={21}
                                    color="#0047AB"
                                />
                            </View>

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

const styles = StyleSheet.create({
    container: { flex: 1 },
    carregandoBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 140,
        gap: 20
    },
    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000"
    },
    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3
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
        shadowOffset: { width: 0, height: 2 }
    },
    areaFoto: {
        position: "relative",
        marginRight: 15
    },
    fotoPadrao: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#E5F0FF",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
    },
    foto: {
        width: 75,
        height: 75,
        borderRadius: 38
    },
    infoPrincipal: { flex: 1 },
    nome: {
        fontSize: 18,
        fontFamily: "Inter_700Bold",
        color: "#222222"
    },
    emailPrincipal: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#777777",
        marginTop: 4
    },
    secao: { width: "100%", gap: 10 },
    tituloSecaoArea: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    iconeSecao: {
        width: 34,
        height: 34,
        borderRadius: 8,
        backgroundColor: "#E5F0FF",
        alignItems: "center",
        justifyContent: "center"
    },
    tituloSecao: {
        fontSize: 18,
        fontFamily: "Inter_800ExtraBold",
        color: "#222222"
    },
    card: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    divisoria: {
        height: 1,
        backgroundColor: "#EEEEEE",
        marginHorizontal: 16
    },
    cardAcoes: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    acao: {
        width: "100%",
        minHeight: 70,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 12
    },
    iconeAcao: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: "#E5F0FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    textosAcao: { flex: 1 },
    tituloAcao: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#222222"
    },
    descricaoAcao: {
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        color: "#777777",
        marginTop: 3
    },
    gap: { gap: 20 }
});