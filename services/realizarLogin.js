import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { requisicao } from './api';
import { getBiometria } from './getBiometria';
import { ativarBiometria, desativarBiometria, biometriaAtiva } from './biometriaStorage';

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

export async function login(cpf, senha) {
    const cpfLimpo = String(cpf || '').replace(/\D/g, '');

    if (!cpfLimpo) {
        return { sucesso: false, mensagem: 'Informe o CPF.' };
    }

    if (cpfLimpo.length !== 11) {
        return { sucesso: false, mensagem: 'CPF incompleto.' };
    }

    if (!senha) {
        return { sucesso: false, mensagem: 'Informe a senha.' };
    }

    try {
        const { ok, status, dados } = await requisicao('/login', {
            method: 'POST',
            body: JSON.stringify({
                cpf_cnpj: cpfLimpo,
                senha
            })
        });

        if (status === 401 || status === 403) {
            return {
                sucesso: false,
                mensagem: dados.error || 'Acesso não autorizado.'
            };
        }

        if (!ok) {
            return {
                sucesso: false,
                mensagem: dados.error || `Erro ${status}: não foi possível entrar.`
            };
        }

        const precisaRedefinir = dados.primeiro_acesso === true || dados.primeiro_acesso === 1;

        await AsyncStorage.setItem('token', dados.token);
        await AsyncStorage.setItem('nome', dados.nome || '');
        await AsyncStorage.setItem('tipo', String(dados.tipo));
        await AsyncStorage.setItem('id_usuario', String(dados.id_usuario));
        await AsyncStorage.setItem('precisa_redefinir_senha', precisaRedefinir ? 'true' : 'false');

        if (!precisaRedefinir) {
            try {
                const jaTemBiometria = await biometriaAtiva(dados.id_usuario);

                if (!jaTemBiometria) {
                    const aceitou = await perguntarAtivarBiometria();

                    if (aceitou) {
                        const biometriaOk = await getBiometria();

                        if (biometriaOk) {
                            await ativarBiometria(dados.id_usuario);
                        }
                    }
                }
            } catch (erroBiometria) {
                console.log('[AUTH] Erro no fluxo de biometria:', erroBiometria);
            }
        }

        return {
            sucesso: true,
            precisaRedefinirSenha: precisaRedefinir,
            usuario: {
                id: dados.id_usuario,
                nome: dados.nome,
                tipo: dados.tipo,
                token: dados.token
            }
        };

    } catch (erro) {
        return {
            sucesso: false,
            mensagem: erro?.message || 'Erro de conexão com o servidor.'
        };
    }
}

export async function logout() {
    try {
        await AsyncStorage.multiRemove([
            'token',
            'nome',
            'tipo',
            'id_usuario',
            'precisa_redefinir_senha'
        ]);
    } catch (erro) {
        console.log('[AUTH] Erro no logout:', erro);
    }
}

export async function usuarioLogado() {
    const token = await AsyncStorage.getItem('token');
    const tipo = await AsyncStorage.getItem('tipo');
    const id = await AsyncStorage.getItem('id_usuario');
    const nome = await AsyncStorage.getItem('nome');

    if (!token || !tipo) {
        return null;
    }

    return {
        token,
        tipo: Number(tipo),
        id: Number(id),
        nome
    };
}