import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import Botao from "../components/Botao";
import CardReuniao from "../components/CardReuniao";
import { buscarReunioes, cancelarReuniao } from "../services/clienteServices";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

function formatarStatus(status) {
    const mapa = {
        'confirmado': 'Confirmada',
        'a_confirmar': 'A confirmar',
        'cancelado': 'Cancelada',
        'recusado': 'Recusada',
        'concluido': 'Realizada',
        'realizado': 'Realizada'
    };
    return mapa[(status || '').toLowerCase()] || status || "--";
}

function normalizarStatus(status) {
    return (status || '').toLowerCase().trim();
}

export default function Reunioes({ navigation }) {
    const [filtro, setFiltro] = useState("proximas");
    const [reunioes, setReunioes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [reuniaoSelecionada, setReuniaoSelecionada] = useState(null);
    const [confirmarCancelamento, setConfirmarCancelamento] = useState(false);
    const [cancelando, setCancelando] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);

        const resultado = await buscarReunioes();

        if (resultado.sucesso) {
            setReunioes(resultado.reunioes);
        }

        setCarregando(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();

            return () => {
                setReuniaoSelecionada(null);
                setConfirmarCancelamento(false);
            };
        }, [carregar])
    );

    useAutoRefresh(carregar, ["agendamento", "notificacao"]);

    const reunioesFiltradas = reunioes.filter((item) => {
        const st = normalizarStatus(item.status);

        if (filtro === "proximas") {
            return st === "confirmado" || st === "a_confirmar";
        }

        if (filtro === "aConfirmar") {
            return st === "a_confirmar";
        }

        if (filtro === "realizadas") {
            return (
                st === "concluido" ||
                st === "realizado" ||
                st === "cancelado" ||
                st === "recusado"
            );
        }

        return true;
    });

    function editarReuniao() {
        navigation.navigate("ReagendarReuniao", {
            reuniao: reuniaoSelecionada
        });
    }

    function abrirCancelamento() {
        setConfirmarCancelamento(true);
    }

    async function confirmarCancelamentoAcao() {
        if (!reuniaoSelecionada) return;

        setCancelando(true);

        const resultado = await cancelarReuniao(
            reuniaoSelecionada.id,
            "Cancelado pelo cliente"
        );

        setCancelando(false);

        if (!resultado.sucesso) {
            Alert.alert("Erro", resultado.mensagem);
            return;
        }

        setConfirmarCancelamento(false);
        setReuniaoSelecionada(null);

        await carregar();
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.titulo}>Reuniões</Text>
                    <Text style={styles.subtitulo}>
                        Acompanhe e gerencie suas reuniões
                    </Text>
                </View>

                <Botao
                    texto={"Agendar reunião"}
                    acao={() => navigation.navigate("AgendarReuniao")}
                />

                <View style={styles.abas}>
                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("proximas")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "proximas" && styles.abaAtiva
                            ]}
                        >
                            Próximas
                        </Text>
                        {filtro === "proximas" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("aConfirmar")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "aConfirmar" && styles.abaAtiva
                            ]}
                        >
                            A Confirmar
                        </Text>
                        {filtro === "aConfirmar" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("realizadas")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "realizadas" && styles.abaAtiva
                            ]}
                        >
                            Realizadas
                        </Text>
                        {filtro === "realizadas" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>
                </View>

                {carregando ? (
                    <ActivityIndicator size="large" color="#0047AB" />
                ) : reunioesFiltradas.length === 0 ? (
                    <Text style={styles.vazio}>
                        Nenhuma reunião encontrada.
                    </Text>
                ) : (
                    <View style={styles.listaReunioes}>
                        {reunioesFiltradas.map((item) => (
                            <CardReuniao
                                key={item.id}
                                titulo={item.assunto || "--"}
                                dia={item.data || "--"}
                                horario={item.horario || "--"}
                                local={item.advogado || "Escritório"}
                                status={formatarStatus(item.status)}
                                acao={
                                    normalizarStatus(item.status) !== "concluido" &&
                                    normalizarStatus(item.status) !== "cancelado" &&
                                    normalizarStatus(item.status) !== "recusado"
                                        ? () => setReuniaoSelecionada(item)
                                        : undefined
                                }
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            {reuniaoSelecionada !== null && !confirmarCancelamento && (
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={styles.fundoOverlay}
                        activeOpacity={1}
                        onPress={() => setReuniaoSelecionada(null)}
                    />

                    <View style={styles.opcoesReuniao}>
                        <View style={styles.topoOpcoes}>
                            <View>
                                <Text style={styles.tituloOpcoes}>
                                    Gerenciar reunião
                                </Text>
                                <Text style={styles.subtituloOpcoes}>
                                    {reuniaoSelecionada.assunto}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.fechar}
                                onPress={() => setReuniaoSelecionada(null)}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={25}
                                    color="#444444"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.resumoReuniao}>
                            <View style={styles.infoResumo}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={19}
                                    color="#0047AB"
                                />
                                <Text style={styles.textoResumo}>
                                    {reuniaoSelecionada.data}
                                </Text>
                            </View>

                            <View style={styles.infoResumo}>
                                <Ionicons
                                    name="time-outline"
                                    size={19}
                                    color="#0047AB"
                                />
                                <Text style={styles.textoResumo}>
                                    {reuniaoSelecionada.horario}
                                </Text>
                            </View>

                            <View style={styles.infoResumo}>
                                <Ionicons
                                    name="person-outline"
                                    size={19}
                                    color="#0047AB"
                                />
                                <Text style={styles.textoResumo}>
                                    {reuniaoSelecionada.advogado || "Escritório"}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.opcaoEditar}
                            onPress={editarReuniao}
                        >
                            <View style={styles.iconeEditar}>
                                <Ionicons
                                    name="create-outline"
                                    size={22}
                                    color="#0047AB"
                                />
                            </View>

                            <View style={styles.textosOpcao}>
                                <Text style={styles.tituloEditar}>
                                    Editar reunião
                                </Text>
                                <Text style={styles.descricaoOpcao}>
                                    Altere a data, horário ou informações
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward-outline"
                                size={20}
                                color="#999999"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.opcaoCancelar}
                            onPress={abrirCancelamento}
                        >
                            <View style={styles.iconeCancelar}>
                                <Ionicons
                                    name="close-circle-outline"
                                    size={22}
                                    color="#FF4D55"
                                />
                            </View>

                            <View style={styles.textosOpcao}>
                                <Text style={styles.tituloCancelar}>
                                    Cancelar reunião
                                </Text>
                                <Text style={styles.descricaoOpcao}>
                                    Cancele este agendamento
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {confirmarCancelamento && reuniaoSelecionada !== null && (
                <View style={styles.overlayConfirmacao}>
                    <View style={styles.fundoConfirmacao} />

                    <View style={styles.cardConfirmacao}>
                        <View style={styles.topoCancelar}>
                            <TouchableOpacity
                                style={styles.fechar}
                                onPress={() => {
                                    setReuniaoSelecionada(null);
                                    setConfirmarCancelamento(false);
                                }}
                            >
                                <Ionicons
                                    name="close-outline"
                                    size={25}
                                    color="#444444"
                                />
                            </TouchableOpacity>

                            <View style={styles.iconeConfirmacao}>
                                <Ionicons
                                    name="alert-circle-outline"
                                    size={35}
                                    color="#FF4D55"
                                />
                            </View>
                        </View>

                        <Text style={styles.tituloConfirmacao}>
                            Cancelar reunião?
                        </Text>

                        <Text style={styles.textoConfirmacao}>
                            Tem certeza de que deseja cancelar a reunião{" "}
                            <Text style={styles.nomeReuniaoConfirmacao}>
                                {reuniaoSelecionada.assunto}
                            </Text>
                            ?
                        </Text>

                        <View style={styles.botoesConfirmacao}>
                            <TouchableOpacity
                                style={styles.botaoVoltar}
                                onPress={() => setConfirmarCancelamento(false)}
                                disabled={cancelando}
                            >
                                <Text style={styles.textoVoltar}>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.botaoCancelar}
                                onPress={confirmarCancelamentoAcao}
                                disabled={cancelando}
                            >
                                <Text style={styles.textoBotaoCancelar}>
                                    {cancelando ? "Cancelando..." : "Sim, cancelar"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flex: 1 },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        gap: 20,
        paddingBottom: 120
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
    abas: {
        width: "100%",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E2E2"
    },
    aba: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 10,
        position: "relative"
    },
    textoAba: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#999999"
    },
    abaAtiva: { color: "#0047AB" },
    linhaAtiva: {
        position: "absolute",
        bottom: -1,
        width: "70%",
        height: 3,
        backgroundColor: "#0047AB",
        borderRadius: 3
    },
    listaReunioes: { width: "100%", gap: 12 },
    vazio: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#888888",
        textAlign: "center",
        marginTop: 20
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "flex-end",
        zIndex: 100,
        elevation: 100
    },
    fundoOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.35)"
    },
    opcoesReuniao: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 120
    },
    topoOpcoes: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 18
    },
    tituloOpcoes: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
        color: "#222222"
    },
    subtituloOpcoes: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3
    },
    fechar: {
        width: 35,
        height: 35,
        borderRadius: 18,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        justifyContent: "center"
    },
    resumoReuniao: {
        width: "100%",
        backgroundColor: "#EEF5FF",
        borderRadius: 8,
        padding: 14,
        marginBottom: 18,
        gap: 8
    },
    infoResumo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    textoResumo: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#444444"
    },
    opcaoEditar: {
        width: "100%",
        minHeight: 65,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },
    iconeEditar: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: "#E5F0FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    tituloEditar: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    },
    opcaoCancelar: {
        width: "100%",
        minHeight: 65,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10
    },
    iconeCancelar: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: "#FFE9EA",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    tituloCancelar: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#FF4D55"
    },
    textosOpcao: { flex: 1 },
    descricaoOpcao: {
        fontSize: 12,
        fontFamily: "Inter_400Regular",
        color: "#777777",
        marginTop: 3
    },
    overlayConfirmacao: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        elevation: 200,
        paddingHorizontal: 30
    },
    fundoConfirmacao: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)"
    },
    cardConfirmacao: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 22,
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
    },
    iconeConfirmacao: {
        width: 65,
        height: 65,
        borderRadius: 33,
        backgroundColor: "#FFE9EA",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15
    },
    tituloConfirmacao: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
        color: "#222222",
        textAlign: "center"
    },
    textoConfirmacao: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 16
    },
    nomeReuniaoConfirmacao: {
        fontFamily: "Inter_700Bold",
        color: "#333333"
    },
    botoesConfirmacao: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 5
    },
    botaoVoltar: {
        width: 150,
        borderWidth: 1,
        borderColor: "#0047AB",
        paddingVertical: 10,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF"
    },
    textoVoltar: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    },
    botaoCancelar: {
        paddingVertical: 10,
        width: 150,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF4D55"
    },
    textoBotaoCancelar: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#FFFFFF"
    },
    topoCancelar: {
        width: "100%",
        flexDirection: "row",
        gap: 93
    }
});