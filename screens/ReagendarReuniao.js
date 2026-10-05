import React, { useState, useEffect } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Input from "../components/Input";
import Botao from "../components/Botao";
import Carregando from "../components/Carregando";

import { buscarDatasDisponiveis, reagendarReuniao } from "../services/clienteServices";

export default function ReagendarReuniao({ navigation, route }) {
    const reuniao = route?.params?.reuniao || null;

    const [carregando, setCarregando] = useState(false);
    const [etapa, setEtapa] = useState(1);

    const [assunto] = useState(reuniao?.assunto || "");
    const [observacoes, setObservacoes] = useState("");

    const [duracao, setDuracao] = useState("60");

    const [data, setData] = useState(null);
    const [horario, setHorario] = useState("");
    const [datas, setDatas] = useState([]);
    const [carregandoDatas, setCarregandoDatas] = useState(false);

    const [modalData, setModalData] = useState(false);

    useEffect(() => {
        const idAdv =
            reuniao?.id_advogado_1 ||
            reuniao?.id_advogado ||
            null;

        carregarDatas(idAdv);
    }, []);

    async function carregarDatas(idAdvogado) {
        setCarregandoDatas(true);
        const r = await buscarDatasDisponiveis(idAdvogado);
        setCarregandoDatas(false);
        if (r.sucesso) setDatas(r.datas);
        else setDatas([]);
    }

    function continuarDados() {
        const dur = parseInt(duracao);

        if (!dur || dur < 30 || dur > 480) {
            Alert.alert("Atenção", "Duração deve ser entre 30 e 480 minutos.");
            return;
        }

        if (!data) {
            Alert.alert("Atenção", "Selecione uma data.");
            return;
        }

        setEtapa(2);
    }

    function continuarHorario() {
        if (!horario) {
            Alert.alert("Atenção", "Selecione um horário.");
            return;
        }
        setEtapa(3);
    }

    async function confirmarAgendamento() {
        if (!reuniao?.id) {
            Alert.alert("Erro", "Reunião não identificada.");
            return;
        }

        setCarregando(true);

        const r = await reagendarReuniao(reuniao.id, {
            data: data.data,
            horario,
            duracao: parseInt(duracao),
            observacoes: observacoes.trim()
        });

        setCarregando(false);

        if (!r.sucesso) {
            Alert.alert("Erro", r.mensagem);
            return;
        }

        Alert.alert(
            "Sucesso",
            "Reagendamento solicitado! Aguarde a confirmação do advogado.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    }

    function selecionarData(item) {
        setData(item);
        setHorario("");
        setModalData(false);
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.main}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View>
                        <Text style={styles.titulo}>Reagendar reunião</Text>
                        <Text style={styles.subtitulo}>
                            Escolha as novas informações da reunião
                        </Text>
                    </View>

                    <View style={styles.etapas}>
                        <View style={styles.etapa}>
                            <View
                                style={[
                                    styles.numeroEtapa,
                                    etapa >= 1 && styles.numeroEtapaAtiva
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.numero,
                                        etapa >= 1 && styles.numeroAtivo
                                    ]}
                                >
                                    1
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.textoEtapa,
                                    etapa === 1 && styles.textoEtapaAtiva
                                ]}
                            >
                                Dados
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.linhaEtapa,
                                etapa >= 2 && styles.linhaEtapaAtiva
                            ]}
                        />

                        <View style={styles.etapa}>
                            <View
                                style={[
                                    styles.numeroEtapa,
                                    etapa >= 2 && styles.numeroEtapaAtiva
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.numero,
                                        etapa >= 2 && styles.numeroAtivo
                                    ]}
                                >
                                    2
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.textoEtapa,
                                    etapa === 2 && styles.textoEtapaAtiva
                                ]}
                            >
                                Horário
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.linhaEtapa,
                                etapa >= 3 && styles.linhaEtapaAtiva
                            ]}
                        />

                        <View style={styles.etapa}>
                            <View
                                style={[
                                    styles.numeroEtapa,
                                    etapa >= 3 && styles.numeroEtapaAtiva
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.numero,
                                        etapa >= 3 && styles.numeroAtivo
                                    ]}
                                >
                                    3
                                </Text>
                            </View>
                            <Text
                                style={[
                                    styles.textoEtapa,
                                    etapa === 3 && styles.textoEtapaAtiva
                                ]}
                            >
                                Confirmar
                            </Text>
                        </View>
                    </View>

                    {etapa === 1 && (
                        <View style={styles.conteudo}>
                            <View>
                                <Text style={styles.label}>Assunto</Text>
                                <View style={styles.campoBloqueado}>
                                    <Text style={styles.textoBloqueado}>
                                        {assunto || "--"}
                                    </Text>
                                </View>
                            </View>

                            <Input
                                label={"Duração (minutos)"}
                                valor={duracao}
                                setValor={setDuracao}
                                tipo={"numeric"}
                            />

                            <View>
                                <Text style={styles.label}>
                                    Nova data
                                </Text>

                                <TouchableOpacity
                                    style={styles.seletor}
                                    onPress={() => setModalData(true)}
                                >
                                    <View style={styles.linhaSeletor}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color="#0047AB"
                                        />
                                        <Text
                                            style={[
                                                styles.placeholder,
                                                data !== null &&
                                                styles.valorSelecionado
                                            ]}
                                        >
                                            {data === null
                                                ? "Selecionar data"
                                                : `${data.data} (${data.semana})`}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-down-outline"
                                        size={20}
                                        color="#0047AB"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View>
                                <Text style={styles.label}>
                                    Observações
                                    <Text style={styles.opcional}> (opcional)</Text>
                                </Text>

                                <TextInput
                                    style={styles.observacoes}
                                    value={observacoes}
                                    onChangeText={setObservacoes}
                                    multiline={true}
                                    textAlignVertical="top"
                                    placeholder="Descreva o motivo do reagendamento..."
                                    placeholderTextColor="#999999"
                                />
                            </View>

                            <Botao
                                texto={"Continuar"}
                                acao={continuarDados}
                            />
                        </View>
                    )}

                    {etapa === 2 && (
                        <View style={styles.conteudo}>
                            <View style={styles.resumoHorario}>
                                <Text style={styles.nomeResumo}>
                                    {reuniao?.advogado || "Reunião"}
                                </Text>
                                <Text style={styles.detalheResumo}>
                                    {data?.data} ({data?.semana})
                                </Text>
                                <Text style={styles.detalheResumo}>
                                    {duracao} minutos
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.tituloSecao}>
                                    Horários disponíveis
                                </Text>
                                <Text style={styles.descricaoSecao}>
                                    Selecione o novo horário para sua reunião
                                </Text>
                            </View>

                            <View style={styles.listaHorarios}>
                                {data?.horarios?.length === 0 ? (
                                    <Text style={styles.vazioTexto}>
                                        Nenhum horário disponível nesta data.
                                    </Text>
                                ) : (
                                    data?.horarios?.map((item) => (
                                        <TouchableOpacity
                                            key={item}
                                            style={[
                                                styles.horario,
                                                horario === item &&
                                                styles.horarioSelecionado
                                            ]}
                                            onPress={() => setHorario(item)}
                                        >
                                            <Ionicons
                                                name="time-outline"
                                                size={20}
                                                color="#0047AB"
                                            />
                                            <Text
                                                style={[
                                                    styles.textoHorario,
                                                    horario === item &&
                                                    styles.textoHorarioSelecionado
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                            {horario === item && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={21}
                                                    color="#0047AB"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))
                                )}
                            </View>

                            <Botao
                                texto={"Continuar"}
                                acao={continuarHorario}
                            />

                            <TouchableOpacity
                                style={styles.botaoVoltar}
                                onPress={() => setEtapa(1)}
                            >
                                <Text style={styles.textoVoltar}>Voltar</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {etapa === 3 && (
                        <View style={styles.conteudo}>
                            <View>
                                <Text style={styles.tituloSecao}>
                                    Confirme os detalhes
                                </Text>
                                <Text style={styles.descricaoSecao}>
                                    Confira as novas informações antes de solicitar
                                </Text>
                            </View>

                            <View style={styles.cardConfirmacao}>
                                <View style={styles.itemConfirmacao}>
                                    <Text style={styles.labelConfirmacao}>
                                        Assunto
                                    </Text>
                                    <Text style={styles.valorConfirmacao}>
                                        {assunto || "--"}
                                    </Text>
                                </View>

                                <View style={styles.divisoria} />

                                <View style={styles.itemConfirmacao}>
                                    <Text style={styles.labelConfirmacao}>
                                        Duração
                                    </Text>
                                    <Text style={styles.valorConfirmacao}>
                                        {duracao} minutos
                                    </Text>
                                </View>

                                <View style={styles.divisoria} />

                                <View style={styles.itemConfirmacao}>
                                    <Text style={styles.labelConfirmacao}>
                                        Nova data
                                    </Text>
                                    <Text style={styles.valorConfirmacao}>
                                        {data?.data} ({data?.semana})
                                    </Text>
                                </View>

                                <View style={styles.divisoria} />

                                <View style={styles.itemConfirmacao}>
                                    <Text style={styles.labelConfirmacao}>
                                        Horário
                                    </Text>
                                    <Text style={styles.valorConfirmacao}>
                                        {horario}
                                    </Text>
                                </View>

                                {observacoes !== "" && (
                                    <>
                                        <View style={styles.divisoria} />
                                        <View style={styles.itemConfirmacao}>
                                            <Text
                                                style={styles.labelConfirmacao}
                                            >
                                                Observações
                                            </Text>
                                            <Text
                                                style={styles.valorConfirmacao}
                                            >
                                                {observacoes}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>

                            <View style={styles.aviso}>
                                <Ionicons
                                    name="information-circle-outline"
                                    size={22}
                                    color="#0047AB"
                                />
                                <Text style={styles.textoAviso}>
                                    A nova data ficará com o status "A confirmar"
                                    até que o advogado aprove o reagendamento.
                                </Text>
                            </View>

                            <Botao
                                texto={"Confirmar reagendamento"}
                                acao={confirmarAgendamento}
                            />

                            <TouchableOpacity
                                style={styles.botaoVoltar}
                                onPress={() => setEtapa(1)}
                            >
                                <Text style={styles.textoVoltar}>
                                    Voltar e editar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {modalData && (
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={styles.fundoOverlay}
                        activeOpacity={1}
                        onPress={() => setModalData(false)}
                    />

                    <View style={styles.modal}>
                        <View style={styles.topoModal}>
                            <View>
                                <Text style={styles.tituloModal}>
                                    Selecionar data
                                </Text>
                                <Text style={styles.subtituloModal}>
                                    Escolha uma nova data disponível
                                </Text>
                            </View>

                            <TouchableOpacity onPress={() => setModalData(false)}>
                                <Ionicons
                                    name="close-outline"
                                    size={27}
                                    color="#222222"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.listaModal}
                            showsVerticalScrollIndicator={false}
                        >
                            {carregandoDatas ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#0047AB"
                                    style={{ marginTop: 20 }}
                                />
                            ) : datas.length === 0 ? (
                                <Text style={styles.vazioTexto}>
                                    Nenhuma data disponível no momento.
                                </Text>
                            ) : (
                                datas.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.opcaoData,
                                            data?.id === item.id &&
                                            styles.opcaoDataSelecionada
                                        ]}
                                        onPress={() => selecionarData(item)}
                                    >
                                        <View style={styles.iconeData}>
                                            <Ionicons
                                                name="calendar-outline"
                                                size={21}
                                                color="#0047AB"
                                            />
                                        </View>
                                        <View style={styles.infoData}>
                                            <Text style={styles.data}>
                                                {item.data}
                                            </Text>
                                            <Text style={styles.semana}>
                                                {item.semana}
                                            </Text>
                                        </View>
                                        {data?.id === item.id && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={22}
                                                color="#0047AB"
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </View>
            )}

            <Carregando
                carregando={carregando}
                texto={"Reservando novo horário..."}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboard: { flex: 1 },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        gap: 25
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
    etapas: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start"
    },
    etapa: { width: 58, alignItems: "center" },
    numeroEtapa: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#0047AB",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center"
    },
    numeroEtapaAtiva: { backgroundColor: "#0047AB" },
    numero: {
        fontSize: 15,
        color: "#0047AB",
        fontFamily: "Inter_700Bold"
    },
    numeroAtivo: { color: "#FFFFFF" },
    textoEtapa: {
        fontSize: 11,
        color: "#777777",
        fontFamily: "Inter_400Regular",
        marginTop: 6
    },
    textoEtapaAtiva: {
        color: "#0047AB",
        fontFamily: "Inter_700Bold"
    },
    linhaEtapa: {
        flex: 1,
        height: 1,
        backgroundColor: "#D6D6D6",
        marginTop: 18
    },
    linhaEtapaAtiva: { backgroundColor: "#0047AB" },
    conteudo: { width: "100%", gap: 22 },
    label: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        marginBottom: 10
    },
    opcional: {
        color: "#777777",
        fontFamily: "Inter_400Regular"
    },
    campoBloqueado: {
        width: "100%",
        minHeight: 50,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        paddingHorizontal: 12,
        paddingVertical: 14
    },
    textoBloqueado: {
        fontSize: 14,
        color: "#666666",
        fontFamily: "Inter_400Regular"
    },
    seletor: {
        width: "100%",
        minHeight: 50,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#0047AB",
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    placeholder: {
        fontSize: 14,
        color: "#777777",
        fontFamily: "Inter_400Regular"
    },
    valorSelecionado: { color: "#222222" },
    linhaSeletor: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    observacoes: {
        width: "100%",
        minHeight: 100,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#0047AB",
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 14,
        color: "#000000",
        fontFamily: "Inter_400Regular"
    },
    resumoHorario: {
        backgroundColor: "#EEF5FF",
        borderRadius: 8,
        padding: 15
    },
    nomeResumo: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#222222"
    },
    detalheResumo: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3
    },
    tituloSecao: { fontSize: 20, fontFamily: "Inter_800ExtraBold" },
    descricaoSecao: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 4
    },
    listaHorarios: { gap: 10 },
    horario: {
        width: "100%",
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D6D6D6",
        paddingHorizontal: 14,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    horarioSelecionado: {
        borderColor: "#0047AB",
        backgroundColor: "#EEF5FF"
    },
    textoHorario: {
        flex: 1,
        fontSize: 14,
        color: "#333333",
        fontFamily: "Inter_700Bold"
    },
    textoHorarioSelecionado: { color: "#0047AB" },
    cardConfirmacao: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    itemConfirmacao: { padding: 16 },
    labelConfirmacao: {
        fontSize: 12,
        color: "#777777",
        fontFamily: "Inter_400Regular",
        marginBottom: 5
    },
    valorConfirmacao: {
        fontSize: 15,
        color: "#222222",
        fontFamily: "Inter_700Bold"
    },
    divisoria: { height: 1, backgroundColor: "#EEEEEE" },
    aviso: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#EEF5FF",
        padding: 14,
        borderRadius: 8,
        gap: 10
    },
    textoAviso: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: "#444444",
        fontFamily: "Inter_400Regular"
    },
    botaoVoltar: { alignSelf: "center", padding: 8 },
    textoVoltar: {
        fontSize: 14,
        color: "#0047AB",
        fontFamily: "Inter_700Bold"
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
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 0
    },
    modal: {
        width: "100%",
        maxHeight: "80%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 25,
        paddingBottom: 120,
        gap: 20,
        zIndex: 1,
        elevation: 101
    },
    topoModal: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    tituloModal: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
        color: "#222222"
    },
    subtituloModal: {
        fontSize: 13,
        color: "#666666",
        fontFamily: "Inter_400Regular",
        marginTop: 3
    },
    listaModal: { maxHeight: 400 },
    opcaoData: {
        minHeight: 65,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },
    opcaoDataSelecionada: { backgroundColor: "#EEF5FF" },
    iconeData: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#E5F0FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    infoData: { flex: 1 },
    data: {
        fontSize: 14,
        color: "#222222",
        fontFamily: "Inter_700Bold"
    },
    semana: {
        fontSize: 12,
        color: "#666666",
        fontFamily: "Inter_400Regular",
        marginTop: 2
    },
    vazioTexto: {
        fontSize: 14,
        color: "#888888",
        fontFamily: "Inter_400Regular",
        textAlign: "center",
        marginTop: 20
    }
});