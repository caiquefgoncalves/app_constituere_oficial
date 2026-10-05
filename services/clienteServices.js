import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { requisicaoAutenticada, API_URL } from './api';

export async function buscarDashboard() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/dashboard');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar dashboard.' };
    return { sucesso: true, dados };
}

export async function buscarMeusDados() {
    const { ok, dados } = await requisicaoAutenticada('/meus_dados');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar dados.' };
    return { sucesso: true, usuario: dados.usuario };
}

export async function buscarProcessos() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/processos');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar processos.' };
    return { sucesso: true, processos: dados.processos || [] };
}

export async function buscarDetalhesProcesso(idProcesso) {
    const { ok, dados } = await requisicaoAutenticada(`/cliente/processo/${idProcesso}`);
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar processo.' };
    return {
        sucesso: true,
        processo: dados.processo,
        atualizacoes: dados.atualizacoes || []
    };
}

export async function buscarPagamentos() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/pagamentos');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar pagamentos.' };
    return { sucesso: true, pagamentos: dados.pagamentos || [] };
}

export async function buscarNotificacoes() {
    const { ok, dados } = await requisicaoAutenticada('/notificacoes');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar notificações.' };
    return { sucesso: true, notificacoes: dados.notificacoes || [] };
}

export async function marcarNotificacoesLidas() {
    const { ok, dados } = await requisicaoAutenticada(
        '/notificacoes/marcar_todas_lidas',
        { method: 'PUT' }
    );

    if (!ok) {
        return {
            sucesso: false,
            mensagem: dados.error || 'Erro ao marcar notificações.'
        };
    }

    return { sucesso: true };
}

export async function buscarReunioes() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/agendamentos');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar reuniões.' };
    return { sucesso: true, reunioes: dados.agendamentos || [] };
}

export async function cancelarReuniao(id, motivo) {
    const { ok, dados } = await requisicaoAutenticada(
        `/cliente/agendamento/${id}/cancelar`,
        { method: 'PUT', body: JSON.stringify({ motivo }) }
    );
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao cancelar reunião.' };
    return { sucesso: true };
}

export async function buscarAdvogadosDisponiveis() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/advogados');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar advogados.' };
    return { sucesso: true, advogados: dados.advogados || [] };
}

export async function buscarDatasDisponiveis(idAdvogado) {
    const url = idAdvogado
        ? `/cliente/datas_disponiveis?id_advogado=${idAdvogado}`
        : '/cliente/datas_disponiveis';

    const { ok, dados } = await requisicaoAutenticada(url);
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar datas.' };
    return { sucesso: true, datas: dados.datas || [] };
}

export async function agendarReuniao(payload) {
    const { ok, dados } = await requisicaoAutenticada('/cliente/agendar', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao agendar reunião.' };
    return { sucesso: true, ...dados };
}

export async function reagendarReuniao(id, payload) {
    const { ok, dados } = await requisicaoAutenticada(
        `/cliente/agendamento/${id}/reagendar`,
        { method: 'PUT', body: JSON.stringify(payload) }
    );
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao reagendar reunião.' };
    return { sucesso: true, ...dados };
}

export async function editarPerfilCliente(campos, fotoUri) {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            return {
                sucesso: false,
                mensagem: 'Sessão expirada. Faça login novamente.'
            };
        }

        const camposString = {};

        Object.entries(campos).forEach(([chave, valor]) => {
            camposString[chave] =
                valor === null || valor === undefined ? '' : String(valor);
        });

        if (fotoUri) {
            const uploadUrl = `${API_URL}/editar_perfil_cliente`;

            const resultado = await FileSystem.uploadAsync(
                uploadUrl,
                fotoUri,
                {
                    httpMethod: 'PUT',
                    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                    fieldName: 'foto_perfil',
                    mimeType: 'image/jpeg',
                    parameters: camposString,
                    headers: {
                        'X-Access-Token': token
                    }
                }
            );

            let dados = {};

            try {
                dados = JSON.parse(resultado.body);
            } catch {
                dados = {};
            }

            if (resultado.status < 200 || resultado.status >= 300) {
                return {
                    sucesso: false,
                    mensagem: dados.error || 'Erro ao editar perfil.'
                };
            }

            return { sucesso: true, ...dados };
        }

        const { ok, dados } = await requisicaoAutenticada(
            '/editar_perfil_cliente',
            {
                method: 'PUT',
                body: JSON.stringify(camposString)
            }
        );

        if (!ok) {
            return {
                sucesso: false,
                mensagem: dados.error || 'Erro ao editar perfil.'
            };
        }

        return { sucesso: true, ...dados };
    } catch (e) {
        console.log('[EDITAR PERFIL] Erro:', e);
        return {
            sucesso: false,
            mensagem: 'Erro de conexão.'
        };
    }
}

export async function buscarProcessos() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/processos');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar processos.' };
    return { sucesso: true, processos: dados.processos || [] };
}



export async function buscarPagamentos() {
    const { ok, dados } = await requisicaoAutenticada('/cliente/pagamentos');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar pagamentos.' };
    return { sucesso: true, pagamentos: dados.pagamentos || [] };
}