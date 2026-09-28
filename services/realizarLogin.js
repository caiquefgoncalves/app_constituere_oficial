import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { requisicao } from './api';
import { getBiometria } from './getBiometria';
import { ativarBiometria, desativarBiometria, biometriaAtiva } from './biometriaStorage';

const TIPOS_PERMITIDOS_APP = [2, 3];

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

    console.log('[AUTH] CPF limpo:', cpfLimpo);

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

        console.log('[AUTH] Status da resposta:', status);
        console.log('[AUTH] Ok:', ok);
        console.log('[AUTH] Dados da resposta:', JSON.stringify(dados));

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

        if (!TIPOS_PERMITIDOS_APP.includes(dados.tipo)) {
            return {
                sucesso: false,
                mensagem: 'Este aplicativo é destinado apenas a clientes. Advogados e escritórios devem usar o sistema web.'
            };
        }

        const precisaRedefinir = dados.primeiro_acesso === true || dados.primeiro_acesso === 1;

        try {
            await AsyncStorage.setItem('token', dados.token);
            await AsyncStorage.setItem('nome', dados.nome || '');
            await AsyncStorage.setItem('tipo', String(dados.tipo));
            await AsyncStorage.setItem('id_usuario', String(dados.id_usuario));
            await AsyncStorage.setItem('precisa_redefinir_senha', precisaRedefinir ? 'true' : 'false');

            console.log('[AUTH] Dados salvos no AsyncStorage.');
        } catch (erroStorage) {
            console.log('[AUTH] Erro ao salvar no AsyncStorage:', erroStorage);
        }

        if (!precisaRedefinir) {
            try {
                const jaTemBiometria = await biometriaAtiva(dados.id_usuario);

                if (!jaTemBiometria) {
                    const aceitou = await perguntarAtivarBiometria();

                    if (aceitou) {
                        const biometriaOk = await getBiometria();

                        if (biometriaOk) {
                            await ativarBiometria(dados.id_usuario);
                            console.log('[AUTH] Biometria ativada para', dados.id_usuario);
                        } else {
                            console.log('[AUTH] Biometria não validada.');
                        }
                    }
                } else {
                    console.log('[AUTH] Biometria já estava ativa.');
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
        console.log('[AUTH] Exceção capturada:', erro);

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

        console.log('[AUTH] Token e dados locais removidos.');
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