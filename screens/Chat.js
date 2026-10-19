import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Keyboard,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../components/Header';
import { API_URL } from '../services/api';
import {
    listarConversas,
    buscarMensagens,
    enviarMensagem,
    iniciarConversa,
    listarAdvogadosDisponiveis
} from '../services/chatServices';
import { criarSocketChat } from '../services/socketChat';

export default function Chat({ navigation }) {
    const [idUsuario, setIdUsuario] = useState(null);
    const [tipoUsuario, setTipoUsuario] = useState(null);
    const [token, setToken] = useState(null);

    const [aba, setAba] = useState('conversas');

    const [advogados, setAdvogados] = useState([]);
    const [carregandoAdvogados, setCarregandoAdvogados] = useState(false);

    const [conversas, setConversas] = useState([]);
    const [carregandoConversas, setCarregandoConversas] = useState(true);
    const [conversaSelecionada, setConversaSelecionada] = useState(null);

    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [carregandoMensagens, setCarregandoMensagens] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const [socketConectado, setSocketConectado] = useState(false);
    const [erro, setErro] = useState('');

    const socketRef = useRef(null);
    const mensagensIdsRef = useRef(new Set());
    const listaRef = useRef(null);
    const inputRef = useRef(null);

    const conversaRef = useRef(null);
    const usuarioIdRef = useRef(null);

    useEffect(() => {
        conversaRef.current = conversaSelecionada;
    }, [conversaSelecionada]);

    useEffect(() => {
        usuarioIdRef.current = idUsuario;
    }, [idUsuario]);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            const t = await AsyncStorage.getItem('token');
            const id = await AsyncStorage.getItem('id_usuario');
            const tp = await AsyncStorage.getItem('tipo');

            if (!ativo) return;

            setToken(t);
            setIdUsuario(id ? parseInt(id, 10) : null);
            setTipoUsuario(tp !== null ? parseInt(tp, 10) : null);

            if (t) {
                await carregarConversas();
                conectarSocket(t);
            }
        }

        carregar();

        return () => {
            ativo = false;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    function conectarSocket(t) {
        const socket = criarSocketChat(t);
        socketRef.current = socket;

        socket.on('connect', () => {
            setSocketConectado(true);
            socket.emit('authenticate', { token: t });
        });

        socket.on('disconnect', () => setSocketConectado(false));
        socket.on('connect_error', () => setSocketConectado(false));

        socket.on('new_message', (data) => {
            const conversaAtual = conversaRef.current;
            const meuId = usuarioIdRef.current;

            if (conversaAtual && data.conversa_id === conversaAtual.conversa_id) {
                if (!mensagensIdsRef.current.has(data.id)) {
                    mensagensIdsRef.current.add(data.id);

                    setMensagens((prev) => {
                        const filtrado = data.remetente_id === meuId
                            ? prev.filter((m) => !m.isTemp)
                            : prev;

                        if (filtrado.some((m) => m.id === data.id)) return prev;

                        return [...filtrado, {
                            id: data.id,
                            remetente_id: data.remetente_id,
                            mensagem: data.mensagem,
                            data: data.data,
                            is_meu_envio: data.remetente_id === meuId
                        }];
                    });

                    setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 100);
                }
            }

            setConversas((prev) => {
                const atual = prev.find((c) => c.conversa_id === data.conversa_id);
                if (!atual) return prev;
                const outras = prev.filter((c) => c.conversa_id !== data.conversa_id);
                return [{ ...atual, ultimo_texto: data.mensagem.substring(0, 35) }, ...outras];
            });
        });
    }

    useEffect(() => {
        if (socketConectado && conversaSelecionada && socketRef.current) {
            socketRef.current.emit('join_conversa', {
                conversa_id: conversaSelecionada.conversa_id
            });
        }
    }, [socketConectado, conversaSelecionada]);

    async function carregarConversas() {
        setCarregandoConversas(true);
        const resultado = await listarConversas();
        if (resultado.sucesso) setConversas(resultado.conversas);
        setCarregandoConversas(false);
    }

    async function carregarAdvogados() {
        setCarregandoAdvogados(true);
        const resultado = await listarAdvogadosDisponiveis();
        if (resultado.sucesso) setAdvogados(resultado.advogados);
        setCarregandoAdvogados(false);
    }

    async function carregarMensagens(idConversa) {
        setCarregandoMensagens(true);
        const resultado = await buscarMensagens(idConversa);
        if (resultado.sucesso) {
            resultado.mensagens.forEach((m) => mensagensIdsRef.current.add(m.id));
            setMensagens(resultado.mensagens);
        }
        setCarregandoMensagens(false);
        setTimeout(() => listaRef.current?.scrollToEnd({ animated: false }), 200);
    }

    useFocusEffect(
        useCallback(() => {
            if (token) carregarConversas();
        }, [token])
    );

    useEffect(() => {
        if (aba === 'novo' && advogados.length === 0 && !carregandoAdvogados) {
            carregarAdvogados();
        }
    }, [aba]);

    async function abrirConversaComAdvogado(advogado) {
        const resultado = await iniciarConversa(advogado.id);

        if (!resultado.sucesso) {
            setErro(resultado.mensagem);
            return;
        }

        await carregarConversas();

        const conversa = {
            conversa_id: resultado.conversa_id,
            usuario_id: advogado.id,
            usuario_nome: advogado.nome,
            usuario_foto: advogado.foto
        };

        setConversaSelecionada(conversa);
        setAba('conversas');
        mensagensIdsRef.current.clear();
        setMensagens([]);
        carregarMensagens(conversa.conversa_id);
    }

    function abrirConversa(conversa) {
        setConversaSelecionada(conversa);
        mensagensIdsRef.current.clear();
        setMensagens([]);
        carregarMensagens(conversa.conversa_id);
    }

    function voltarLista() {
        Keyboard.dismiss();
        setConversaSelecionada(null);
        setMensagens([]);
        mensagensIdsRef.current.clear();
        carregarConversas();
    }

    async function enviar() {
        const texto = novaMensagem.trim();
        if (!texto || !conversaSelecionada) return;

        const temp = {
            id: `temp_${Date.now()}`,
            remetente_id: idUsuario,
            mensagem: texto,
            data: new Date().toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }),
            is_meu_envio: true,
            isTemp: true
        };

        setMensagens((prev) => [...prev, temp]);
        setNovaMensagem('');
        setEnviando(true);

        setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 100);

        const resultado = await enviarMensagem(conversaSelecionada.conversa_id, texto);

        if (!resultado.sucesso) {
            setMensagens((prev) => prev.filter((m) => m.id !== temp.id));
        } else {
            await carregarMensagens(conversaSelecionada.conversa_id);
            await carregarConversas();
        }

        setEnviando(false);
    }

    function imagemUrl(id) {
        return `${API_URL}/uploads/Usuarios/${id}.jpeg`;
    }

    function iniciais(nome) {
        if (!nome) return '?';
        return nome.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
    }

    const idsComConversa = new Set(conversas.map((c) => c.usuario_id));
    const advogadosSemConversa = advogados.filter((a) => !idsComConversa.has(a.id));

    const renderConversa = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => abrirConversa(item)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: imagemUrl(item.usuario_id) }} style={styles.avatar} />
            <View style={styles.cardInfo}>
                <Text style={styles.cardNome} numberOfLines={1}>{item.usuario_nome}</Text>
                <Text style={styles.cardMsg} numberOfLines={1}>
                    {item.ultimo_texto || 'Nenhuma mensagem ainda'}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );

    const renderAdvogado = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => abrirConversaComAdvogado(item)}
            activeOpacity={0.7}
        >
            <Image source={{ uri: imagemUrl(item.id) }} style={styles.avatar} />
            <View style={styles.cardInfo}>
                <Text style={styles.cardNome} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.cardMsg} numberOfLines={1}>{item.cargo || 'Advogado'}</Text>
            </View>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#0047AB" />
        </TouchableOpacity>
    );

    const renderMensagem = ({ item }) => (
        <View style={[styles.msgLinha, item.is_meu_envio ? styles.msgDireita : styles.msgEsquerda]}>
            <View style={[styles.balao, item.is_meu_envio ? styles.balaoEu : styles.balaoVoce]}>
                <Text style={item.is_meu_envio ? styles.textoBalaoEu : styles.textoBalaoVoce}>
                    {item.mensagem}
                </Text>
                <Text style={[styles.dataMsg, item.is_meu_envio ? styles.dataBalaoEu : styles.dataBalaoVoce]}>
                    {item.data}
                    {item.isTemp ? ' • enviando...' : ''}
                </Text>
            </View>
        </View>
    );

    if (!token) {
        return (
            <SafeAreaView style={styles.container}>
                <Header navigation={navigation} />
                <View style={styles.carregandoBox}>
                    <ActivityIndicator size="large" color="#0047AB" />
                </View>
            </SafeAreaView>
        );
    }

    if (conversaSelecionada) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#2A2929' }}>
                <StatusBar barStyle="light-content" backgroundColor="#2A2929" />

                <View style={styles.headerChat}>
                    <TouchableOpacity onPress={voltarLista} style={styles.btnIcone}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: imagemUrl(conversaSelecionada.usuario_id) }}
                        style={styles.avatarHeader}
                    />

                    <View style={styles.headerInfo}>
                        <Text style={styles.headerNome} numberOfLines={1}>
                            {conversaSelecionada.usuario_nome}
                        </Text>
                    </View>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: '#F5F7FA' }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FlatList
                        ref={listaRef}
                        data={mensagens}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderMensagem}
                        contentContainerStyle={styles.listaMensagens}
                        keyboardShouldPersistTaps="handled"
                        onContentSizeChange={() => listaRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => listaRef.current?.scrollToEnd({ animated: false })}
                        ListEmptyComponent={
                            carregandoMensagens ? (
                                <ActivityIndicator color="#0047AB" style={{ marginTop: 20 }} />
                            ) : (
                                <Text style={styles.vazio}>Nenhuma mensagem ainda. Envie a primeira!</Text>
                            )
                        }
                    />

                    <View style={styles.inputArea}>
                        <TextInput
                            ref={inputRef}
                            style={styles.input}
                            placeholder="Digite uma mensagem..."
                            placeholderTextColor="#9CA3AF"
                            value={novaMensagem}
                            onChangeText={setNovaMensagem}
                            multiline
                            onFocus={() => setTimeout(() => listaRef.current?.scrollToEnd({ animated: true }), 200)}
                        />
                        <TouchableOpacity
                            style={[styles.btnEnviar, (!novaMensagem.trim() || enviando) && styles.btnEnviarOff]}
                            onPress={enviar}
                            disabled={!novaMensagem.trim() || enviando}
                        >
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2A2929" />

            <Header navigation={navigation} />

            <View style={styles.abas}>
                <TouchableOpacity
                    style={[styles.aba, aba === 'conversas' && styles.abaAtiva]}
                    onPress={() => setAba('conversas')}
                >
                    <Text style={[styles.abaTexto, aba === 'conversas' && styles.abaTextoAtivo]}>
                        Conversas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.aba, aba === 'novo' && styles.abaAtiva]}
                    onPress={() => setAba('novo')}
                >
                    <Text style={[styles.abaTexto, aba === 'novo' && styles.abaTextoAtivo]}>
                        Nova Conversa
                    </Text>
                </TouchableOpacity>
            </View>

            {erro ? <Text style={styles.erro}>{erro}</Text> : null}

            {aba === 'conversas' && (
                carregandoConversas ? (
                    <ActivityIndicator size="large" color="#0047AB" style={{ marginTop: 40 }} />
                ) : conversas.length === 0 ? (
                    <View style={styles.vazioBox}>
                        <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.vazioTitulo}>Nenhuma conversa ainda</Text>
                        <Text style={styles.vazioSub}>
                            Toque em "Nova Conversa" para falar com um advogado.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={conversas}
                        keyExtractor={(item) => String(item.conversa_id)}
                        renderItem={renderConversa}
                        contentContainerStyle={styles.lista}
                        keyboardShouldPersistTaps="handled"
                    />
                )
            )}

            {aba === 'novo' && (
                carregandoAdvogados ? (
                    <ActivityIndicator size="large" color="#0047AB" style={{ marginTop: 40 }} />
                ) : advogadosSemConversa.length === 0 ? (
                    <View style={styles.vazioBox}>
                        <Ionicons name="people-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.vazioTitulo}>Nenhum advogado disponível</Text>
                        <Text style={styles.vazioSub}>
                            {advogados.length > 0
                                ? 'Você já iniciou conversa com todos os advogados do seu escritório.'
                                : 'Não encontramos advogados no seu escritório.'}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={advogadosSemConversa}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={renderAdvogado}
                        contentContainerStyle={styles.lista}
                        keyboardShouldPersistTaps="handled"
                    />
                )
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    carregandoBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    abas: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        gap: 10
    },
    aba: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB'
    },
    abaAtiva: {
        backgroundColor: '#0047AB',
        borderColor: '#0047AB'
    },
    abaTexto: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        color: '#0047AB'
    },
    abaTextoAtivo: {
        color: '#FFFFFF'
    },
    lista: { padding: 20, gap: 12 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        gap: 12,
        elevation: 2,
        shadowColor: '#000000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E3EDF8' },
    cardInfo: { flex: 1 },
    cardNome: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#222222' },
    cardMsg: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#666666', marginTop: 2 },
    vazioBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 8 },
    vazioTitulo: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#374151', marginTop: 8 },
    vazioSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#9CA3AF', textAlign: 'center' },
    erro: {
        textAlign: 'center',
        color: '#FF4D55',
        fontFamily: 'Inter_400Regular',
        fontSize: 13,
        paddingHorizontal: 20,
        paddingTop: 10
    },
    headerChat: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 14,
        backgroundColor: '#2A2929',
        gap: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    btnIcone: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    avatarHeader: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E3EDF8' },
    headerInfo: { flex: 1 },
    headerNome: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter_700Bold' },
    listaMensagens: { padding: 16, gap: 8, paddingBottom: 20 },
    msgLinha: { flexDirection: 'row' },
    msgDireita: { justifyContent: 'flex-end' },
    msgEsquerda: { justifyContent: 'flex-start' },
    balao: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
    balaoEu: { backgroundColor: '#0047AB', borderBottomRightRadius: 4 },
    balaoVoce: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' },
    textoBalaoEu: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_400Regular' },
    textoBalaoVoce: { color: '#222222', fontSize: 15, fontFamily: 'Inter_400Regular' },
    dataMsg: { fontSize: 10, marginTop: 4 },
    dataBalaoEu: { color: '#D1E0F5' },
    dataBalaoVoce: { color: '#9CA3AF' },
    vazio: { textAlign: 'center', color: '#9CA3AF', fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 30 },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 10,
        gap: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB'
    },
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 120,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F5F7FA',
        borderRadius: 22,
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        color: '#222222'
    },
    btnEnviar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#0047AB',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnEnviarOff: { opacity: 0.5 }
});