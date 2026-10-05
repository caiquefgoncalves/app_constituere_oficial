import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    ActivityIndicator
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import Header from "../components/Header";
import Input from "../components/Input";
import Botao from "../components/Botao";
import Carregando from "../components/Carregando";

import {
    buscarMeusDados,
    editarPerfilCliente
} from "../services/clienteServices";

import { API_URL } from "../services/api";

export default function EditarPerfil({ navigation, route }) {
    const tipoCliente = route?.params?.tipoCliente || "fisico";
    const juridico = tipoCliente === "juridico";

    const [carregandoDados, setCarregandoDados] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [fotoErro, setFotoErro] = useState(false);
    const [versaoFoto, setVersaoFoto] = useState(Date.now());

    const [idUsuario, setIdUsuario] = useState(null);

    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cpf, setCpf] = useState("");
    const [sexo, setSexo] = useState("");
    const [estadoCivil, setEstadoCivil] = useState("");
    const [rg, setRg] = useState("");
    const [orgaoExpedidor, setOrgaoExpedidor] = useState("");
    const [nacionalidade, setNacionalidade] = useState("");
    const [carteiraTrabalho, setCarteiraTrabalho] = useState("");
    const [serieCarteira, setSerieCarteira] = useState("");
    const [profissao, setProfissao] = useState("");

    const [razaoSocial, setRazaoSocial] = useState("");
    const [nomeFantasia, setNomeFantasia] = useState("");
    const [cnpj, setCnpj] = useState("");

    const [cep, setCep] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [numero, setNumero] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");

    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");

    const [fotoUri, setFotoUri] = useState(null);

    const sexos = [
        "Feminino",
        "Masculino",
        "Outro",
        "Prefiro não informar"
    ];

    const estadosCivis = [
        "Solteiro(a)",
        "Casado(a)",
        "Divorciado(a)",
        "Viúvo(a)",
        "União estável"
    ];

    const estados = [
        "Acre",
        "Alagoas",
        "Amapá",
        "Amazonas",
        "Bahia",
        "Ceará",
        "Distrito Federal",
        "Espírito Santo",
        "Goiás",
        "Maranhão",
        "Mato Grosso",
        "Mato Grosso do Sul",
        "Minas Gerais",
        "Pará",
        "Paraíba",
        "Paraná",
        "Pernambuco",
        "Piauí",
        "Rio de Janeiro",
        "Rio Grande do Norte",
        "Rio Grande do Sul",
        "Rondônia",
        "Roraima",
        "Santa Catarina",
        "São Paulo",
        "Sergipe",
        "Tocantins"
    ];

    useEffect(() => {
        async function carregar() {
            const resultado = await buscarMeusDados();

            if (resultado.sucesso && resultado.usuario) {
                const u = resultado.usuario;

                setIdUsuario(u.id);
                setNome(u.nome || "");
                setEmail(u.email || "");
                setTelefone(u.telefone || "");
                setCpf(u.cpf || "");
                setRg(u.rg || "");
                setOrgaoExpedidor(u.orgao_expedidor || "");
                setNacionalidade(u.nacionalidade || "");
                setEstadoCivil(u.estado_civil || "");
                setVersaoFoto(Date.now());
            }

            setCarregandoDados(false);
        }

        carregar();
    }, []);

    async function tirarFoto() {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissao.granted) {
            Alert.alert(
                "Permissão necessária",
                "Precisamos da permissão de câmera para tirar sua foto."
            );
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
        });

        if (!resultado.canceled && resultado.assets?.length > 0) {
            setFotoUri(resultado.assets[0].uri);
            setFotoErro(false);
        }
    }

    async function escolherDaGaleria() {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissao.granted) {
            Alert.alert(
                "Permissão necessária",
                "Precisamos da permissão da galeria para escolher sua foto."
            );
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7
        });

        if (!resultado.canceled && resultado.assets?.length > 0) {
            setFotoUri(resultado.assets[0].uri);
            setFotoErro(false);
        }
    }

    function abrirOpcoesFoto() {
        Alert.alert(
            "Foto de perfil",
            "Como deseja adicionar sua foto?",
            [
                { text: "Tirar foto", onPress: tirarFoto },
                { text: "Escolher da galeria", onPress: escolherDaGaleria },
                { text: "Cancelar", style: "cancel" }
            ]
        );
    }

    function montarCampos() {
        return {
            nome: nome || "",
            email: email || "",
            telefone: telefone || "",
            cpf: cpf || "",
            cnpj: cnpj || "",
            razao_social: razaoSocial || "",
            nome_fantasia: nomeFantasia || "",
            data_nascimento: dataNascimento || "",
            sexo: sexo || "",
            rg: rg || "",
            orgao_expedidor: orgaoExpedidor || "",
            nacionalidade: nacionalidade || "",
            estado_civil: estadoCivil || "",
            carteira_trabalho: carteiraTrabalho || "",
            serie_carteira: serieCarteira || "",
            profissao: profissao || "",
            cep: cep || "",
            logradouro: logradouro || "",
            numero: numero || "",
            complemento: complemento || "",
            bairro: bairro || "",
            cidade: cidade || "",
            estado: estado || ""
        };
    }

    async function salvarPerfil() {
        if (!nome && !razaoSocial) {
            Alert.alert("Atenção", "Informe o nome.");
            return;
        }

        if (!email) {
            Alert.alert("Atenção", "Informe o e-mail.");
            return;
        }

        setSalvando(true);

        const campos = montarCampos();

        const resultado = await editarPerfilCliente(campos, fotoUri);

        setSalvando(false);

        if (!resultado.sucesso) {
            Alert.alert("Erro", resultado.mensagem);
            return;
        }

        setVersaoFoto(Date.now());

        Alert.alert(
            "Sucesso",
            "Perfil atualizado com sucesso!",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    }

    const urlFotoAtual = idUsuario
        ? `${API_URL}/uploads/Usuarios/${idUsuario}.jpeg?v=${versaoFoto}`
        : null;

    const mostrarFoto = fotoUri
        ? true
        : (urlFotoAtual && !fotoErro);

    const fonteFoto = fotoUri ? { uri: fotoUri } : { uri: urlFotoAtual };

    if (carregandoDados) {
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
                        <Text style={styles.titulo}>Editar perfil</Text>
                        <Text style={styles.subtitulo}>
                            {juridico
                                ? "Atualize as informações da empresa"
                                : "Atualize suas informações pessoais"}
                        </Text>
                    </View>

                    <View style={styles.areaFoto}>
                        <TouchableOpacity
                            style={styles.fotoBox}
                            onPress={abrirOpcoesFoto}
                        >
                            {mostrarFoto ? (
                                <Image
                                    source={fonteFoto}
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

                            <View style={styles.fotoBadge}>
                                <Ionicons
                                    name="camera-outline"
                                    size={18}
                                    color="#FFFFFF"
                                />
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.textoFoto}>
                            Toque para alterar a foto
                        </Text>
                    </View>

                    {!juridico && (
                        <>
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

                                    <Select
                                        label={"Sexo"}
                                        valor={sexo}
                                        setValor={setSexo}
                                        opcoes={sexos}
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

                                    <Select
                                        label={"Estado civil"}
                                        valor={estadoCivil}
                                        setValor={setEstadoCivil}
                                        opcoes={estadosCivis}
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
                                </View>
                            </View>
                        </>
                    )}

                    {juridico && (
                        <>
                            <View style={styles.secao}>
                                <View style={styles.tituloSecaoArea}>
                                    <View style={styles.iconeSecao}>
                                        <Ionicons
                                            name="business-outline"
                                            size={21}
                                            color="#0047AB"
                                        />
                                    </View>
                                    <Text style={styles.tituloSecao}>
                                        Dados da empresa
                                    </Text>
                                </View>

                                <View style={styles.card}>
                                    <Input
                                        label={"Razão social"}
                                        valor={razaoSocial}
                                        setValor={setRazaoSocial}
                                        letraMaiuscula={"words"}
                                    />

                                    <Input
                                        label={"Nome fantasia"}
                                        valor={nomeFantasia}
                                        setValor={setNomeFantasia}
                                        letraMaiuscula={"words"}
                                    />

                                    <Input
                                        label={"CNPJ"}
                                        valor={cnpj}
                                        setValor={setCnpj}
                                        tipo={"numeric"}
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.secao}>
                        <View style={styles.tituloSecaoArea}>
                            <View style={styles.iconeSecao}>
                                <Ionicons
                                    name="location-outline"
                                    size={22}
                                    color="#0047AB"
                                />
                            </View>
                            <Text style={styles.tituloSecao}>Endereço</Text>
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
                            <Select
                                label={"Estado"}
                                valor={estado}
                                setValor={setEstado}
                                opcoes={estados}
                                grande={true}
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
                            <Text style={styles.tituloSecao}>Contato</Text>
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
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.textoCancelar}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Carregando carregando={salvando} texto={"Salvando..."} />
        </View>
    );
}

function Select({ label, valor, setValor, opcoes, grande = false }) {
    const [aberto, setAberto] = useState(false);

    function selecionar(opcao) {
        setValor(opcao);
        setAberto(false);
    }

    return (
        <View style={styles.selectContainer}>
            <Text style={styles.labelSelect}>{label}</Text>

            <TouchableOpacity
                style={[styles.select, aberto && styles.selectAberto]}
                onPress={() => setAberto(!aberto)}
            >
                <Text
                    style={[
                        styles.valorSelect,
                        valor === "" && styles.placeholderSelect
                    ]}
                >
                    {valor === "" ? "Selecione" : valor}
                </Text>

                <Ionicons
                    name={aberto ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color="#0047AB"
                />
            </TouchableOpacity>

            {aberto && (
                <View
                    style={[
                        styles.opcoesSelect,
                        grande && styles.opcoesSelectGrande
                    ]}
                >
                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        keyboardShouldPersistTaps="handled"
                    >
                        {opcoes.map((opcao) => (
                            <TouchableOpacity
                                key={opcao}
                                style={[
                                    styles.opcaoSelect,
                                    valor === opcao && styles.opcaoSelecionada
                                ]}
                                onPress={() => selecionar(opcao)}
                            >
                                <Text
                                    style={[
                                        styles.textoOpcao,
                                        valor === opcao &&
                                        styles.textoOpcaoSelecionada
                                    ]}
                                >
                                    {opcao}
                                </Text>

                                {valor === opcao && (
                                    <Ionicons
                                        name="checkmark-outline"
                                        size={19}
                                        color="#0047AB"
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboard: { flex: 1 },
    carregandoBox: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
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
    areaFoto: {
        width: "100%",
        alignItems: "center",
        gap: 8
    },
    fotoBox: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "#E5F0FF",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
    },
    foto: {
        width: 110,
        height: 110,
        borderRadius: 55
    },
    fotoBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#0047AB",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#FFFFFF"
    },
    textoFoto: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#666666"
    },
    secao: {
        width: "100%",
        gap: 10
    },
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
        padding: 16,
        gap: 18,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    selectContainer: { width: "100%" },
    labelSelect: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: "Inter_700Bold",
        color: "#000000"
    },
    select: {
        width: "100%",
        height: 44,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#0047AB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    selectAberto: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    valorSelect: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#000000"
    },
    placeholderSelect: { color: "#999999" },
    opcoesSelect: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: "#0047AB",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        overflow: "hidden"
    },
    opcoesSelectGrande: { maxHeight: 220 },
    opcaoSelect: {
        minHeight: 44,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE"
    },
    opcaoSelecionada: { backgroundColor: "#EEF5FF" },
    textoOpcao: {
        flex: 1,
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#333333"
    },
    textoOpcaoSelecionada: {
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    },
    botoes: { width: "100%", gap: 8 },
    cancelar: {
        width: "100%",
        height: 48,
        alignItems: "center",
        justifyContent: "center"
    },
    textoCancelar: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    }
});