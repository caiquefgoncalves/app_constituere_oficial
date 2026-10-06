import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Image
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

import { perguntarVeritas } from "../services/clienteServices";

const MENSAGEM_INICIAL = {
    id: 1,
    autor: "veritas",
    texto:
        "Olá! Sou a Veritas.AI, sua assistente jurídica. Posso ajudar você a:\n\n" +
        "1. Tirar dúvidas jurídicas gerais.\n" +
        "2. Consultar seus débitos, parcelas em aberto e vencimentos.\n" +
        "3. Buscar advogados do seu escritório por área de atuação.\n" +
        "4. Solicitar uma reunião com um advogado.\n" +
        "5. Alterar seus próprios dados cadastrais.\n\n" +
        "Como posso ajudar?"
};

function formatarTexto(texto, corTexto = "#333333") {
    const partes = String(texto || "").split(/(\*\*[^*]+\*\*)/g);

    return partes.map((parte, index) => {
        if (parte.startsWith("**") && parte.endsWith("**")) {
            return (
                <Text
                    key={index}
                    style={[
                        styles.textoMensagemNegrito,
                        { color: corTexto }
                    ]}
                >
                    {parte.slice(2, -2)}
                </Text>
            );
        }

        return (
            <Text
                key={index}
                style={[styles.textoMensagem, { color: corTexto }]}
            >
                {parte}
            </Text>
        );
    });
}

export default function ChatVeritas({ visivel, onFechar }) {
    const [mensagens, setMensagens] = useState([MENSAGEM_INICIAL]);
    const [input, setInput] = useState("");
    const [digitando, setDigitando] = useState(false);
    const [executandoAcao, setExecutandoAcao] = useState(false);

    const [vozAtivada, setVozAtivada] = useState(true);
    const [velocidadeVoz, setVelocidadeVoz] = useState(1.15);

    const scrollRef = useRef(null);
    const ultimaMensagemLidaRef = useRef(null);
    const primeiraLeituraRef = useRef(true);

    useEffect(() => {
        async function carregarPreferenciasVoz() {
            try {
                const vozSalva = await AsyncStorage.getItem("veritas_voz_ativada");
                const velocidadeSalva = await AsyncStorage.getItem("veritas_velocidade_voz");

                if (vozSalva !== null) {
                    setVozAtivada(vozSalva === "true");
                }

                if (velocidadeSalva !== null) {
                    setVelocidadeVoz(Number(velocidadeSalva) || 1.15);
                }
            } catch (e) {
                console.log("[VERITAS] Erro ao carregar preferências de voz:", e);
            }
        }

        carregarPreferenciasVoz();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("veritas_voz_ativada", String(vozAtivada));
    }, [vozAtivada]);

    useEffect(() => {
        AsyncStorage.setItem("veritas_velocidade_voz", String(velocidadeVoz));
    }, [velocidadeVoz]);

    useEffect(() => {
        if (!visivel) {
            Speech.stop();
        }

        return () => {
            Speech.stop();
        };
    }, [visivel]);

    useEffect(() => {
        const ultima = mensagens[mensagens.length - 1];

        if (primeiraLeituraRef.current) {
            primeiraLeituraRef.current = false;
            ultimaMensagemLidaRef.current = ultima?.id;
            return;
        }

        if (!vozAtivada) return;
        if (!ultima || ultima.autor !== "veritas") return;
        if (ultima.id === ultimaMensagemLidaRef.current) return;
        if (!ultima.texto || ultima.texto.length < 2) return;

        ultimaMensagemLidaRef.current = ultima.id;

        const textoLimpo = ultima.texto
            .replace(/\*\*/g, "")
            .replace(/\n+/g, ". ")
            .trim();

        Speech.stop();

        Speech.speak(textoLimpo, {
            language: "pt-BR",
            rate: velocidadeVoz,
            pitch: 1.12
        });
    }, [mensagens, vozAtivada, velocidadeVoz]);

    useEffect(() => {
        if (visivel) {
            carregarHistorico();
        }
    }, [visivel]);

    useEffect(() => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollToEnd({ animated: true });
            }
        }, 100);
    }, [mensagens, digitando]);

    async function carregarHistorico() {
        try {
            const idUsuario = await AsyncStorage.getItem("id_usuario");

            if (!idUsuario) {
                setMensagens([MENSAGEM_INICIAL]);
                return;
            }

            const chave = `veritas_historico_${idUsuario}`;
            const salvo = await AsyncStorage.getItem(chave);

            if (!salvo) {
                setMensagens([MENSAGEM_INICIAL]);
                return;
            }

            const parsed = JSON.parse(salvo);

            if (!Array.isArray(parsed) || parsed.length === 0) {
                setMensagens([MENSAGEM_INICIAL]);
                return;
            }

            setMensagens(parsed);
        } catch {
            setMensagens([MENSAGEM_INICIAL]);
        }
    }

    async function salvarHistorico(novasMensagens) {
        try {
            const idUsuario = await AsyncStorage.getItem("id_usuario");

            if (!idUsuario) return;

            const chave = `veritas_historico_${idUsuario}`;
            const ultimas = novasMensagens.slice(-24);

            await AsyncStorage.setItem(chave, JSON.stringify(ultimas));
        } catch (e) {
            console.log("[VERITAS] Erro ao salvar histórico:", e);
        }
    }

    async function apagarHistorico() {
        Speech.stop();

        try {
            const idUsuario = await AsyncStorage.getItem("id_usuario");

            if (idUsuario) {
                await AsyncStorage.removeItem(`veritas_historico_${idUsuario}`);
            }
        } catch {}

        setMensagens([MENSAGEM_INICIAL]);
        ultimaMensagemLidaRef.current = null;
    }

    async function enviar() {
        const texto = input.trim();

        if (!texto || digitando) return;

        const novaMensagemUsuario = {
            id: Date.now(),
            autor: "usuario",
            texto
        };

        const listaComUsuario = [...mensagens, novaMensagemUsuario];

        setMensagens(listaComUsuario);
        setInput("");
        setDigitando(true);

        try {
            const historico = mensagens.slice(-12).map((msg) => ({
                role: msg.autor === "usuario" ? "user" : "assistant",
                content: msg.texto
            }));

            const resultado = await perguntarVeritas(texto, historico);

            if (!resultado.sucesso) {
                const novaMensagem = {
                    id: Date.now() + 1,
                    autor: "veritas",
                    texto:
                        resultado.mensagem || "Erro ao consultar a Veritas."
                };

                const listaFinal = [...listaComUsuario, novaMensagem];
                setMensagens(listaFinal);
                salvarHistorico(listaFinal);
                return;
            }

            const novaMensagem = {
                id: Date.now() + 1,
                autor: "veritas",
                texto:
                    resultado.resposta ||
                    "Não consegui gerar uma resposta agora.",
                acao: resultado.acao_proposta || null
            };

            const listaFinal = [...listaComUsuario, novaMensagem];
            setMensagens(listaFinal);
            salvarHistorico(listaFinal);
        } catch (e) {
            console.log("[VERITAS] Erro:", e);

            const novaMensagem = {
                id: Date.now() + 1,
                autor: "veritas",
                texto:
                    "Não consegui conectar com a Veritas agora. Verifique se a API está rodando e tente novamente."
            };

            const listaFinal = [...listaComUsuario, novaMensagem];
            setMensagens(listaFinal);
            salvarHistorico(listaFinal);
        } finally {
            setDigitando(false);
        }
    }

    async function confirmarAcao(idMensagem, acao) {
        if (!acao || executandoAcao) return;

        setExecutandoAcao(true);

        try {
            const token = await AsyncStorage.getItem("token");
            const { API_URL } = require("../services/api");

            const resposta = await fetch(`${API_URL}${acao.endpoint}`, {
                method: acao.metodo,
                headers: {
                    "Content-Type": "application/json",
                    "X-Access-Token": token
                },
                body: JSON.stringify(acao.dados)
            });

            const dados = await resposta.json().catch(() => ({}));

            if (!resposta.ok) {
                throw new Error(
                    dados.error || "Não foi possível concluir a ação."
                );
            }

            const listaAtualizada = mensagens.map((msg) =>
                msg.id === idMensagem ? { ...msg, acao: null } : msg
            );

            const novaMensagem = {
                id: Date.now(),
                autor: "veritas",
                texto:
                    dados.mensagem ||
                    dados.message ||
                    "Ação concluída com sucesso."
            };

            const listaFinal = [...listaAtualizada, novaMensagem];
            setMensagens(listaFinal);
            salvarHistorico(listaFinal);
        } catch (e) {
            const novaMensagem = {
                id: Date.now(),
                autor: "veritas",
                texto: e.message || "Não foi possível concluir a ação."
            };

            const listaFinal = [...mensagens, novaMensagem];
            setMensagens(listaFinal);
        } finally {
            setExecutandoAcao(false);
        }
    }

    function alternarVoz() {
        const novoEstado = !vozAtivada;
        setVozAtivada(novoEstado);

        if (!novoEstado) {
            Speech.stop();
        }
    }

    function alternarVelocidade() {
        const opcoes = [0.9, 1, 1.15, 1.3, 1.5, 1.75, 2];
        const indiceAtual = opcoes.findIndex((v) => Math.abs(v - velocidadeVoz) < 0.01);
        const proximoIndice = (indiceAtual + 1) % opcoes.length;
        setVelocidadeVoz(opcoes[proximoIndice]);
    }

    return (
        <Modal
            visible={visivel}
            animationType="slide"
            transparent={true}
            onRequestClose={onFechar}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.fundoOverlay}
                    activeOpacity={1}
                    onPress={onFechar}
                />

                <KeyboardAvoidingView
                    style={styles.containerChat}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.header}>
                        <View style={styles.headerInfo}>
                            <Image
                                source={require("../assets/veritas.png")}
                                style={styles.avatarHeader}
                                resizeMode="cover"
                            />
                            <Text style={styles.tituloHeader}>
                                Veritas.AI
                            </Text>
                        </View>

                        <View style={styles.acoesCabecalho}>
                            <TouchableOpacity
                                style={[
                                    styles.botaoVoz,
                                    vozAtivada && styles.botaoVozAtiva
                                ]}
                                onPress={alternarVoz}
                            >
                                <Ionicons
                                    name={vozAtivada ? "volume-high" : "volume-mute"}
                                    size={18}
                                    color="#2b2200"
                                />
                            </TouchableOpacity>

                            {vozAtivada && (
                                <TouchableOpacity
                                    style={styles.botaoVelocidade}
                                    onPress={alternarVelocidade}
                                >
                                    <Text style={styles.textoVelocidade}>
                                        {velocidadeVoz}x
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.botaoLimpar}
                                onPress={apagarHistorico}
                            >
                                <Text style={styles.textoLimpar}>
                                    Limpar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.botaoFechar}
                                onPress={onFechar}
                            >
                                <Ionicons
                                    name="close"
                                    size={22}
                                    color="#2b2200"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        style={styles.mensagens}
                        contentContainerStyle={styles.mensagensConteudo}
                        showsVerticalScrollIndicator={false}
                    >
                        {mensagens.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.mensagem,
                                    msg.autor === "usuario"
                                        ? styles.mensagemUsuario
                                        : styles.mensagemVeritas
                                ]}
                            >
                                {msg.autor === "veritas" && (
                                    <Image
                                        source={require("../assets/veritas.png")}
                                        style={styles.avatarMensagem}
                                        resizeMode="cover"
                                    />
                                )}

                                <View
                                    style={[
                                        styles.balao,
                                        msg.autor === "usuario"
                                            ? styles.balaoUsuario
                                            : styles.balaoVeritas
                                    ]}
                                >
                                    <View>
                                        {formatarTexto(
                                            msg.texto,
                                            msg.autor === "usuario"
                                                ? "#2b2200"
                                                : "#333333"
                                        )}
                                    </View>

                                    {msg.acao && (
                                        <View style={styles.acaoProposta}>
                                            <Text style={styles.acaoTitulo}>
                                                Ação proposta
                                            </Text>
                                            <View>
                                                {formatarTexto(
                                                    msg.acao.descricao,
                                                    "#333333"
                                                )}
                                            </View>

                                            <TouchableOpacity
                                                style={
                                                    styles.botaoConfirmarAcao
                                                }
                                                onPress={() =>
                                                    confirmarAcao(
                                                        msg.id,
                                                        msg.acao
                                                    )
                                                }
                                                disabled={executandoAcao}
                                            >
                                                <Text
                                                    style={
                                                        styles.textoBotaoConfirmar
                                                    }
                                                >
                                                    {executandoAcao
                                                        ? "Executando..."
                                                        : "Confirmar ação"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}

                        {digitando && (
                            <View
                                style={[
                                    styles.mensagem,
                                    styles.mensagemVeritas
                                ]}
                            >
                                <Image
                                    source={require("../assets/veritas.png")}
                                    style={styles.avatarMensagem}
                                    resizeMode="cover"
                                />
                                <View
                                    style={[
                                        styles.balao,
                                        styles.balaoVeritas
                                    ]}
                                >
                                    <ActivityIndicator
                                        size="small"
                                        color="#f5b700"
                                    />
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.formulario}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Pergunte algo à Veritas..."
                            placeholderTextColor="#999999"
                            editable={!digitando && !executandoAcao}
                            multiline={false}
                            onSubmitEditing={enviar}
                        />

                        <TouchableOpacity
                            style={[
                                styles.botaoEnviar,
                                (!input.trim() || digitando) &&
                                styles.botaoEnviarDesabilitado
                            ]}
                            onPress={enviar}
                            disabled={
                                !input.trim() ||
                                digitando ||
                                executandoAcao
                            }
                        >
                            <Ionicons
                                name="send"
                                size={20}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    fundoOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)"
    },
    containerChat: {
        width: "100%",
        maxWidth: 520,
        height: "85%",
        maxHeight: 640,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        elevation: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: "#f5b700"
    },
    headerInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    avatarHeader: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#FFFFFF"
    },
    tituloHeader: {
        fontSize: 19,
        fontFamily: "Inter_700Bold",
        color: "#2b2200"
    },
    acoesCabecalho: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    botaoVoz: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0, 0, 0, 0.12)",
        alignItems: "center",
        justifyContent: "center"
    },
    botaoVozAtiva: {
        backgroundColor: "rgba(255, 255, 255, 0.5)"
    },
    botaoVelocidade: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 7,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        alignItems: "center",
        justifyContent: "center"
    },
    textoVelocidade: {
        fontSize: 12,
        fontFamily: "Inter_700Bold",
        color: "#2b2200"
    },
    botaoLimpar: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "rgba(43, 34, 0, 0.35)",
        backgroundColor: "rgba(255, 255, 255, 0.45)"
    },
    textoLimpar: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#2b2200"
    },
    botaoFechar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0, 0, 0, 0.12)",
        alignItems: "center",
        justifyContent: "center"
    },
    mensagens: {
        flex: 1,
        backgroundColor: "#F7F7F7"
    },
    mensagensConteudo: {
        padding: 16,
        gap: 14
    },
    mensagem: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        maxWidth: "88%"
    },
    mensagemVeritas: {
        alignSelf: "flex-start"
    },
    mensagemUsuario: {
        alignSelf: "flex-end",
        flexDirection: "row-reverse"
    },
    avatarMensagem: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#FFFFFF"
    },
    balao: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        maxWidth: "100%"
    },
    balaoVeritas: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6E6E6",
        borderBottomLeftRadius: 4
    },
    balaoUsuario: {
        backgroundColor: "#f5b700",
        borderBottomRightRadius: 4
    },
    textoMensagem: {
        fontSize: 17,
        lineHeight: 24,
        fontFamily: "Inter_400Regular"
    },
    textoMensagemNegrito: {
        fontSize: 17,
        lineHeight: 24,
        fontFamily: "Inter_700Bold"
    },
    acaoProposta: {
        marginTop: 10,
        paddingTop: 9,
        borderTopWidth: 1,
        borderTopColor: "#E6E6E6",
        gap: 7
    },
    acaoTitulo: {
        color: "#0047AB",
        fontFamily: "Inter_700Bold",
        fontSize: 15
    },
    botaoConfirmarAcao: {
        marginTop: 6,
        backgroundColor: "#0047AB",
        borderRadius: 8,
        paddingVertical: 9,
        paddingHorizontal: 14,
        alignItems: "center"
    },
    textoBotaoConfirmar: {
        color: "#FFFFFF",
        fontFamily: "Inter_700Bold",
        fontSize: 15
    },
    formulario: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#EAEAEA"
    },
    input: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 22,
        backgroundColor: "#F7F7F7",
        color: "#333333",
        fontSize: 17,
        fontFamily: "Inter_400Regular"
    },
    botaoEnviar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#0047AB",
        alignItems: "center",
        justifyContent: "center"
    },
    botaoEnviarDesabilitado: {
        opacity: 0.5
    }
});