import { requisicaoAutenticada } from './api';

export async function listarConversas() {
    const { ok, dados } = await requisicaoAutenticada('/dm/listar_conversas');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar conversas.' };
    return { sucesso: true, conversas: dados.conversas || [] };
}

export async function buscarMensagens(idConversa) {
    const { ok, dados } = await requisicaoAutenticada(`/dm/mensagens/${idConversa}`);
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar mensagens.' };
    return { sucesso: true, mensagens: dados.mensagens || [] };
}

export async function enviarMensagem(idConversa, mensagem) {
    const { ok, dados } = await requisicaoAutenticada(
        `/dm/enviar_mensagem/${idConversa}`,
        {
            method: 'POST',
            body: JSON.stringify({ mensagem })
        }
    );
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao enviar mensagem.' };
    return { sucesso: true, ...dados };
}

export async function iniciarConversa(idContato) {
    const { ok, dados } = await requisicaoAutenticada(
        `/dm/iniciar_conversa/${idContato}`,
        { method: 'POST' }
    );
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao iniciar conversa.' };
    return { sucesso: true, ...dados };
}

export async function listarAdvogadosDisponiveis() {
    const { ok, dados } = await requisicaoAutenticada('/dm/advogados_disponiveis');
    if (!ok) return { sucesso: false, mensagem: dados.error || 'Erro ao carregar advogados.' };
    return { sucesso: true, advogados: dados.advogados || [] };
}