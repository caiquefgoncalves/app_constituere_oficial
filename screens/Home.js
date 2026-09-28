import React, { useEffect, useState } from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Botao from "../components/Botao";
import { getBiometria } from '../services/getBiometria';
import { biometriaAtiva, ativarBiometria } from '../services/biometriaStorage';
import { logout } from '../services/realizarLogin';

function perguntarAtivarBiometria() {
    return new Promise((resolve) => {
        Alert.alert(
            'Ativar biometria?',
            'Deseja usar sua biometria para entrar mais rápido nas próximas vezes?',
            [
                {
                    text: 'Agora não',
                    style: 'cancel',
                    onPress: () => resolve(false)
                },
                {
                    text: 'Ativar',
                    onPress: () => resolve(true)
                }
            ],
            { cancelable: false }
        );
    });
}

export function Home({navigation}) {

    const [logado, setLogado] = useState(false);
    const [idUsuario, setIdUsuario] = useState(null);
    const [mostrarBotaoLogin, setMostrarBotaoLogin] = useState(false);

    useEffect(() => {
        let ativo = true;

        async function verificarLogin() {
            try {
                const token = await AsyncStorage.getItem('token');
                const idSalvo = await AsyncStorage.getItem('id_usuario');
                const precisaRedefinir = await AsyncStorage.getItem('precisa_redefinir_senha');

                if (!ativo) return;

                if (precisaRedefinir === 'true') {
                    navigation.navigate('RedefinirSenha');
                    return;
                }

                if (token && idSalvo) {
                    setLogado(true);
                    setIdUsuario(Number(idSalvo));
                }
            } catch (erro) {
                console.log('[HOME] Erro ao verificar login:', erro);
            }
        }

        verificarLogin();

        return () => {
            ativo = false;
        };
    }, []);

    async function acessarPlataforma() {
        if (!logado) {
            navigation.navigate("Login");
            return;
        }

        try {
            const temBiometriaAtiva = await biometriaAtiva(idUsuario);

            if (!temBiometriaAtiva) {
                const aceitou = await perguntarAtivarBiometria();

                if (aceitou) {
                    const biometriaOk = await getBiometria();

                    if (biometriaOk) {
                        await ativarBiometria(idUsuario);
                    } else {
                        Alert.alert(
                            'Biometria não reconhecida',
                            'Não foi possível ativar a biometria. Você pode tentar novamente depois.'
                        );
                        setMostrarBotaoLogin(true);
                        return;
                    }
                }

                navigation.navigate("Dashboard");
                return;
            }

            const biometriaOk = await getBiometria();

            if (biometriaOk) {
                navigation.navigate("Dashboard");
            } else {
                Alert.alert(
                    'Biometria não reconhecida',
                    'Não foi possível confirmar sua identidade. Tente novamente.'
                );
                setMostrarBotaoLogin(true);
            }
        } catch (erro) {
            console.log('[HOME] Erro ao validar biometria:', erro);
            Alert.alert('Erro', 'Não foi possível validar sua biometria.');
            setMostrarBotaoLogin(true);
        }
    }

    async function realizarLoginNovamente() {
        await logout();

        setLogado(false);
        setIdUsuario(null);
        setMostrarBotaoLogin(false);

        navigation.reset({
            index: 0,
            routes: [{name: 'Login'}]
        });
    }

    return (
        <ImageBackground source={require("../assets/telaInicial.png")} resizeMode="cover" style={styles.background}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <Image style={styles.logo} source={require("../assets/logoMenor.png")}/>
                </View>

                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)', '#000000']}
                    style={styles.transicaoGradiente}
                />

                <View style={styles.main}>
                    <Text style={styles.texto}>Vivendo o direito de um novo jeito</Text>

                    <View style={styles.areaInferior}>
                        <View style={styles.botao}>
                            <Botao
                                texto={"Acesse a plataforma"}
                                acao={acessarPlataforma}
                            />
                        </View>

                        {logado && mostrarBotaoLogin && (
                            <TouchableOpacity
                                style={styles.botaoRealizarLogin}
                                onPress={realizarLoginNovamente}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.textoBotaoRealizarLogin}>
                                    Realizar login
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        flex: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    main: {
        flex: 4,
        width: '100%',
        backgroundColor: "black",
        height: "100%",
        paddingHorizontal: 40,
        paddingBottom: 100,
        justifyContent: "space-between",
    },
    texto: {
        color: "white",
        fontWeight: "bold",
        fontSize: 35,
        fontFamily: "Inter_900Black",
        maxWidth: "90%",
    },
    areaInferior: {
        width: '100%',
        alignItems: 'flex-end',
        gap: 12,
    },
    botao: {
        alignItems: "flex-end",
    },
    botaoRealizarLogin: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#FFFFFF",
        borderWidth: 0.9,

    },
    textoBotaoRealizarLogin: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 2,
        fontFamily: 'Inter_700Bold',

    },
    transicaoGradiente: {
        width: '100%',
        height: 200,
    },
});