import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Input from "../components/Input";
import Botao from "../components/Botao";


export default function AgendarReuniao({ navigation }) {

    const [etapa, setEtapa] = useState(1);

    const [assunto, setAssunto] = useState("");
    const [observacoes, setObservacoes] = useState("");

    const [advogado, setAdvogado] = useState(null);
    const [buscaAdvogado, setBuscaAdvogado] = useState("");

    const [duracao, setDuracao] = useState("");

    const [data, setData] = useState(null);
    const [horario, setHorario] = useState("");

    const [modalAdvogado, setModalAdvogado] = useState(false);
    const [modalData, setModalData] = useState(false);


    const advogados = [
        {
            id: 1,
            nome: "Dr. Carlos Mendes",
            oab: "OAB/SP 123456",
        },

        {
            id: 2,
            nome: "Dra. Mariana Alves",
            oab: "OAB/SP 654321",
        },

        {
            id: 3,
            nome: "Dr. Rafael Souza",
            oab: "OAB/SP 112233",
        },

        {
            id: 4,
            nome: "Dra. Fernanda Oliveira",
            oab: "OAB/SP 445566",
        }
    ];


    const datas = [
        {
            id: 1,
            data: "03/08/2026",
            semana: "Segunda-feira"
        },

        {
            id: 2,
            data: "04/08/2026",
            semana: "Terça-feira"
        },

        {
            id: 3,
            data: "05/08/2026",
            semana: "Quarta-feira"
        },

        {
            id: 4,
            data: "06/08/2026",
            semana: "Quinta-feira"
        },

        {
            id: 5,
            data: "07/08/2026",
            semana: "Sexta-feira"
        },

        {
            id: 6,
            data: "10/08/2026",
            semana: "Segunda-feira"
        },

        {
            id: 7,
            data: "11/08/2026",
            semana: "Terça-feira"
        }
    ];


    const horarios = [
        "08:00",
        "09:00",
        "10:30",
        "13:00",
        "14:30",
        "16:00",
        "17:00"
    ];


    function continuarDados() {
        setEtapa(2);
    }


    function continuarHorario() {
        setEtapa(3);
    }


    function confirmarAgendamento() {

        console.log({
            assunto,
            advogado,
            duracao,
            data,
            horario,
            observacoes,
            status: "A confirmar"
        });

        navigation.navigate("Reunioes");
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

                        <Text style={styles.titulo}>
                            Agendar reunião
                        </Text>

                        <Text style={styles.subtitulo}>
                            Marque um horário com seu advogado
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

                            <Input
                                label={"Assunto da reunião"}
                                valor={assunto}
                                setValor={setAssunto}
                                letraMaiuscula={"sentences"}
                            />



                            <View>

                                <Text style={styles.label}>
                                    Advogado
                                </Text>

                                <TouchableOpacity
                                    style={styles.seletor}
                                    onPress={() =>
                                        setModalAdvogado(true)
                                    }
                                >

                                    {advogado === null ? (

                                        <Text style={styles.placeholder}>
                                            Selecionar advogado
                                        </Text>

                                    ) : (

                                        <View style={styles.advogadoSelecionado}>

                                            <View style={styles.iconeAdvogado}>

                                                <Ionicons
                                                    name="person-outline"
                                                    size={21}
                                                    color="#0047AB"
                                                />

                                            </View>


                                            <View>

                                                <Text style={styles.nomeAdvogado}>
                                                    {advogado.nome}
                                                </Text>

                                                <Text style={styles.oab}>
                                                    {advogado.oab}
                                                </Text>

                                            </View>

                                        </View>

                                    )}


                                    <Ionicons
                                        name="chevron-down-outline"
                                        size={20}
                                        color="#0047AB"
                                    />

                                </TouchableOpacity>

                            </View>



                            <Input
                                label={"Duração"}
                                valor={duracao}
                                setValor={setDuracao}
                                tipo={"numeric"}
                            />



                            <View>

                                <Text style={styles.label}>
                                    Preferência de data
                                </Text>

                                <TouchableOpacity
                                    style={styles.seletor}
                                    onPress={() =>
                                        setModalData(true)
                                    }
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
                                                : `${data.data} (${data.semana})`
                                            }

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

                                    <Text style={styles.opcional}>
                                        {" "} (opcional)
                                    </Text>

                                </Text>


                                <TextInput
                                    style={styles.observacoes}
                                    value={observacoes}
                                    onChangeText={setObservacoes}
                                    multiline={true}
                                    textAlignVertical="top"
                                    placeholder="Descreva brevemente o que deseja tratar na reunião..."
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
                                    {advogado?.nome}
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
                                    Selecione o melhor horário para sua reunião
                                </Text>

                            </View>


                            <View style={styles.listaHorarios}>

                                {horarios.map((item) => (

                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.horario,
                                            horario === item &&
                                            styles.horarioSelecionado
                                        ]}
                                        onPress={() =>
                                            setHorario(item)
                                        }
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

                                ))}

                            </View>


                            <Botao
                                texto={"Continuar"}
                                acao={continuarHorario}
                            />


                            <TouchableOpacity
                                style={styles.botaoVoltar}
                                onPress={() => setEtapa(1)}
                            >

                                <Text style={styles.textoVoltar}>
                                    Voltar
                                </Text>

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
                                    Confira as informações antes de solicitar
                                </Text>

                            </View>


                            <View style={styles.cardConfirmacao}>



                                <View style={styles.itemConfirmacao}>

                                    <Text style={styles.labelConfirmacao}>
                                        Assunto
                                    </Text>

                                    <Text style={styles.valorConfirmacao}>
                                        {assunto}
                                    </Text>

                                </View>


                                <View style={styles.divisoria} />



                                <View style={styles.itemConfirmacao}>

                                    <Text style={styles.labelConfirmacao}>
                                        Advogado
                                    </Text>

                                    <Text style={styles.valorConfirmacao}>
                                        {advogado?.nome}
                                    </Text>

                                    <Text style={styles.oab}>
                                        {advogado?.oab}
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
                                        Data
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

                                            <Text style={styles.labelConfirmacao}>
                                                Observações
                                            </Text>

                                            <Text style={styles.valorConfirmacao}>
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
                                    A reunião ficará com o status "A confirmar"
                                    até que o advogado aprove o agendamento.
                                </Text>

                            </View>


                            <Botao
                                texto={"Confirmar agendamento"}
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

            <View
                visible={modalAdvogado}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                    setModalAdvogado(false)
                }
            >

                <KeyboardAvoidingView
                    style={styles.keyboardModal}
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : "height"
                    }
                >

                    <View style={styles.overlay}>

                        <View style={styles.modal}>

                            <View style={styles.topoModal}>

                                <Text style={styles.tituloModal}>
                                    Selecionar advogado
                                </Text>


                                <TouchableOpacity
                                    onPress={() => {

                                        setModalAdvogado(false);
                                        setBuscaAdvogado("");

                                    }}
                                >

                                    <Ionicons
                                        name="close-outline"
                                        size={27}
                                        color="#222222"
                                    />

                                </TouchableOpacity>

                            </View>


                            <Input
                                label={"Buscar advogado"}
                                valor={buscaAdvogado}
                                setValor={setBuscaAdvogado}
                                letraMaiuscula={"words"}
                            />


                            <ScrollView
                                style={styles.listaModal}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >

                                {advogados
                                    .filter((item) =>
                                        item.nome
                                            .toLowerCase()
                                            .includes(
                                                buscaAdvogado.toLowerCase()
                                            )
                                    )
                                    .map((item) => (

                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.advogadoModal}
                                            onPress={() => {

                                                setAdvogado(item);

                                                setModalAdvogado(false);

                                                setBuscaAdvogado("");

                                                setHorario("");

                                            }}
                                        >

                                            <View style={styles.iconeAdvogado}>

                                                <Ionicons
                                                    name="person-outline"
                                                    size={22}
                                                    color="#0047AB"
                                                />

                                            </View>


                                            <View>

                                                <Text style={styles.nomeAdvogado}>
                                                    {item.nome}
                                                </Text>

                                                <Text style={styles.oab}>
                                                    {item.oab}
                                                </Text>

                                            </View>

                                        </TouchableOpacity>

                                    ))}

                            </ScrollView>

                        </View>

                    </View>

                </KeyboardAvoidingView>

            </View>

            <View
                visible={modalData}
                transparent={true}
                animationType="slide"
                onRequestClose={() =>
                    setModalData(false)
                }
            >

                <View style={styles.overlay}>

                    <View style={styles.modal}>

                        <View style={styles.topoModal}>

                            <View>

                                <Text style={styles.tituloModal}>
                                    Selecionar data
                                </Text>

                                <Text style={styles.subtituloModal}>
                                    Escolha uma data disponível
                                </Text>

                            </View>


                            <TouchableOpacity
                                onPress={() =>
                                    setModalData(false)
                                }
                            >

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

                            {datas.map((item) => (

                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.opcaoData,
                                        data?.id === item.id &&
                                        styles.opcaoDataSelecionada
                                    ]}
                                    onPress={() => {

                                        setData(item);

                                        setHorario("");

                                        setModalData(false);

                                    }}
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

                            ))}

                        </ScrollView>

                    </View>

                </View>

            </View>

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

    keyboardModal: {
        flex: 1,
    },


    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        gap: 25,
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



    etapas: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
    },

    etapa: {
        width: 58,
        alignItems: "center",
    },

    numeroEtapa: {
        width: 36,
        height: 36,
        borderRadius: 18,

        borderWidth: 1,
        borderColor: "#0047AB",

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",
    },

    numeroEtapaAtiva: {
        backgroundColor: "#0047AB",
    },

    numero: {
        fontSize: 15,
        color: "#0047AB",
        fontFamily: "Inter_700Bold",
    },

    numeroAtivo: {
        color: "#FFFFFF",
    },

    textoEtapa: {
        fontSize: 11,
        color: "#777777",
        fontFamily: "Inter_400Regular",
        marginTop: 6,
    },

    textoEtapaAtiva: {
        color: "#0047AB",
        fontFamily: "Inter_700Bold",
    },

    linhaEtapa: {
        flex: 1,
        height: 1,
        backgroundColor: "#D6D6D6",
        marginTop: 18,
    },

    linhaEtapaAtiva: {
        backgroundColor: "#0047AB",
    },



    conteudo: {
        width: "100%",
        gap: 22,
    },

    label: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        marginBottom: 10,
    },

    opcional: {
        color: "#777777",
        fontFamily: "Inter_400Regular",
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
        justifyContent: "space-between",
    },

    placeholder: {
        fontSize: 14,
        color: "#777777",
        fontFamily: "Inter_400Regular",
    },

    valorSelecionado: {
        color: "#222222",
    },

    linhaSeletor: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },



    advogadoSelecionado: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconeAdvogado: {
        width: 40,
        height: 40,

        borderRadius: 20,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 10,
    },

    nomeAdvogado: {
        fontSize: 14,
        color: "#222222",
        fontFamily: "Inter_700Bold",
    },

    oab: {
        fontSize: 11,
        color: "#999999",
        fontFamily: "Inter_400Regular",
        marginTop: 2,
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
        fontFamily: "Inter_400Regular",
    },



    resumoHorario: {
        backgroundColor: "#EEF5FF",
        borderRadius: 8,
        padding: 15,
    },

    nomeResumo: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#222222",
    },

    detalheResumo: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3,
    },

    tituloSecao: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
    },

    descricaoSecao: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 4,
    },

    listaHorarios: {
        gap: 10,
    },

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

        gap: 10,
    },

    horarioSelecionado: {
        borderColor: "#0047AB",
        backgroundColor: "#EEF5FF",
    },

    textoHorario: {
        flex: 1,

        fontSize: 14,
        color: "#333333",
        fontFamily: "Inter_700Bold",
    },

    textoHorarioSelecionado: {
        color: "#0047AB",
    },



    cardConfirmacao: {
        width: "100%",
        backgroundColor: "#FFFFFF",

        borderRadius: 10,

        elevation: 3,

        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 5,

        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    itemConfirmacao: {
        padding: 16,
    },

    labelConfirmacao: {
        fontSize: 12,
        color: "#777777",
        fontFamily: "Inter_400Regular",
        marginBottom: 5,
    },

    valorConfirmacao: {
        fontSize: 15,
        color: "#222222",
        fontFamily: "Inter_700Bold",
    },

    divisoria: {
        height: 1,
        backgroundColor: "#EEEEEE",
    },



    aviso: {
        flexDirection: "row",
        alignItems: "flex-start",

        backgroundColor: "#EEF5FF",

        padding: 14,
        borderRadius: 8,

        gap: 10,
    },

    textoAviso: {
        flex: 1,

        fontSize: 13,
        lineHeight: 19,

        color: "#444444",
        fontFamily: "Inter_400Regular",
    },



    botaoVoltar: {
        alignSelf: "center",
        padding: 8,
    },

    textoVoltar: {
        fontSize: 14,
        color: "#0047AB",
        fontFamily: "Inter_700Bold",
    },



    overlay: {
        flex: 1,

        backgroundColor: "rgba(0,0,0,0.35)",

        justifyContent: "flex-end",
    },

    modal: {
        width: "100%",
        maxHeight: "80%",

        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,

        padding: 25,

        gap: 20,
    },

    topoModal: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },

    tituloModal: {
        fontSize: 20,
        fontFamily: "Inter_800ExtraBold",
    },

    subtituloModal: {
        fontSize: 13,
        color: "#666666",
        fontFamily: "Inter_400Regular",
        marginTop: 3,
    },

    listaModal: {
        maxHeight: 400,
    },



    advogadoModal: {
        flexDirection: "row",
        alignItems: "center",

        paddingVertical: 13,

        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },



    opcaoData: {
        minHeight: 65,

        flexDirection: "row",
        alignItems: "center",

        paddingVertical: 10,

        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    opcaoDataSelecionada: {
        backgroundColor: "#EEF5FF",
    },

    iconeData: {
        width: 40,
        height: 40,

        borderRadius: 8,

        backgroundColor: "#E5F0FF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 12,
    },

    infoData: {
        flex: 1,
    },

    data: {
        fontSize: 14,
        color: "#222222",
        fontFamily: "Inter_700Bold",
    },

    semana: {
        fontSize: 12,
        color: "#666666",
        fontFamily: "Inter_400Regular",
        marginTop: 2,
    },

});