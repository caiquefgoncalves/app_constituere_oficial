import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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
            camposString[chave] = valor === null || valor === undefined
                ? ''
                : String(valor);
        });

        if (fotoUri) {
            const resultado = await FileSystem.uploadAsync(
                `${API_URL}/editar_perfil_cliente`,
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

export async function criarCobrancaBoleto(idParcela, tipoParcela) {
    const { ok, dados } = await requisicaoAutenticada(
        '/cliente/pagamento/boleto',
        {
            method: 'POST',
            body: JSON.stringify({
                id_parcela: idParcela,
                tipo_parcela: tipoParcela || 'prolabore'
            })
        }
    );

    console.log(">>> [CRIAR BOLETO] ok:", ok);
    console.log(">>> [CRIAR BOLETO] dados:", JSON.stringify(dados, null, 2));

    if (!ok) {
        return {
            sucesso: false,
            mensagem: dados.error || 'Erro ao gerar boleto.'
        };
    }

    return {
        sucesso: true,
        id_cobranca: dados.id_cobranca,
        codigo_pagamento: dados.codigo_pagamento,
        valor: dados.valor,
        id_pagador: dados.id_pagador,
        id_recebedor: dados.id_recebedor,
        data_vencimento: dados.data_vencimento,
        url_pdf: dados.url_pdf

    };
}

export async function consultarCobrancaBoleto(
    idCobranca,
    idParcela,
    tipoParcela
) {
    const params = new URLSearchParams();

    params.append('id_parcela', String(idParcela));
    params.append('tipo_parcela', tipoParcela || 'prolabore');

    const { ok, dados } = await requisicaoAutenticada(
        `/cliente/pagamento/boleto/${idCobranca}?${params.toString()}`
    );

    if (!ok) {
        return {
            sucesso: false,
            mensagem: dados.error || 'Erro ao consultar boleto.'
        };
    }

    return {
        sucesso: true,
        pago: dados.pago,
        status: dados.status,
        valor: dados.valor
    };
}

export async function abrirPdfBoleto(
    idCobranca,
    idParcela,
    tipoParcela
) {
    try {
        console.log('[BOLETO PDF] Iniciando...');

        const token = await AsyncStorage.getItem('token');

        if (!token) {
            console.log('[BOLETO PDF] Token não encontrado');

            return {
                sucesso: false,
                mensagem: 'Sessão expirada.'
            };
        }

        const params = new URLSearchParams({
            id_parcela: String(idParcela),
            tipo_parcela: tipoParcela || 'prolabore'
        });

        const url = `${API_URL}/cliente/pagamento/boleto/${idCobranca}/pdf?${params.toString()}`;

        console.log('[BOLETO PDF] URL:', url);
        console.log('[BOLETO PDF] Token presente:', !!token);

        const caminho = `${FileSystem.cacheDirectory}boleto_${idCobranca}.pdf`;

        console.log('[BOLETO PDF] Caminho:', caminho);
        console.log('[BOLETO PDF] Iniciando download...');

        const resultado = await FileSystem.downloadAsync(
            url,
            caminho,
            {
                headers: {
                    'X-Access-Token': token
                }
            }
        );

        console.log('[BOLETO PDF] Download concluído');
        console.log('[BOLETO PDF] Status:', resultado.status);
        console.log('[BOLETO PDF] URI:', resultado.uri);

        if (resultado.status !== 200) {
            return {
                sucesso: false,
                mensagem: `Erro ao baixar boleto (${resultado.status}).`
            };
        }

        const arquivo = await FileSystem.getInfoAsync(resultado.uri);

        console.log('[BOLETO PDF] Arquivo:', arquivo);

        if (!arquivo.exists || !arquivo.size) {
            return {
                sucesso: false,
                mensagem: 'O PDF não foi baixado corretamente.'
            };
        }

        const disponivel = await Sharing.isAvailableAsync();

        console.log('[BOLETO PDF] Sharing disponível:', disponivel);

        if (!disponivel) {
            return {
                sucesso: false,
                mensagem: 'Não é possível abrir o PDF neste dispositivo.'
            };
        }

        console.log('[BOLETO PDF] Abrindo compartilhamento...');

        await Sharing.shareAsync(resultado.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Boleto Constituere',
            UTI: 'com.adobe.pdf'
        });

        console.log('[BOLETO PDF] Compartilhamento aberto');

        return { sucesso: true };

    } catch (error) {
        console.log('[BOLETO PDF] ERRO:', error);
        console.log('[BOLETO PDF] Mensagem:', error?.message);

        return {
            sucesso: false,
            mensagem: error?.message || 'Erro ao abrir boleto.'
        };
    }
}

export async function pagarComCartao(payload) {
    try {
        const { ok, dados } = await requisicaoAutenticada(
            '/cliente/pagamento/cartao',
            {
                method: 'POST',
                body: JSON.stringify(payload)
            }
        );

        if (!ok) {
            return {
                sucesso: false,
                aprovado: dados?.aprovado === true,
                mensagem: dados?.error || 'Erro ao processar pagamento.',
                verificar_antes_de_repetir:
                    dados?.verificar_antes_de_repetir === true,
                id_compra: dados?.id_compra
            };
        }

        return {
            sucesso: true,
            aprovado: dados.aprovado === true,
            mensagem: dados.mensagem,
            id_compra: dados.id_compra,
            id_movimentacao: dados.id_movimentacao,
            valor: dados.valor,
            valor_recebido: dados.valor_recebido,
            taxa: dados.taxa,
            tipo: dados.tipo,
            parcelas: dados.parcelas,
            final_cartao: dados.final_cartao
        };

    } catch (error) {
        console.log('[CARTAO] Falha na requisição');

        return {
            sucesso: false,
            mensagem: 'Não foi possível verificar o resultado do pagamento. Confira antes de tentar novamente.',
            verificar_antes_de_repetir: true
        };
    }
}

export async function criarCobrancaPix(idParcela, tipoParcela) {
    const { ok, dados } = await requisicaoAutenticada(
        '/cliente/pagamento/pix',
        {
            method: 'POST',
            body: JSON.stringify({
                id_parcela: idParcela,
                tipo_parcela: tipoParcela || 'prolabore'
            })
        }
    );

    console.log(">>> [CRIAR PIX] ok:", ok);
    console.log(">>> [CRIAR PIX] dados:", JSON.stringify(dados, null, 2));

    if (!ok) {
        return {
            sucesso: false,
            mensagem: dados.error || 'Erro ao gerar cobrança Pix.'
        };
    }

    return {
        sucesso: true,
        id_cobranca: dados.id_cobranca,
        codigo_pagamento: dados.codigo_pagamento,
        qr_code: dados.qr_code,
        valor: dados.valor
    };
}


export async function consultarCobrancaPix(idCobranca, idParcela, tipoParcela) {
    const params = new URLSearchParams();

    if (idParcela) params.append('id_parcela', String(idParcela));
    if (tipoParcela) params.append('tipo_parcela', tipoParcela);

    const query = params.toString();
    const url = `/cliente/pagamento/pix/${idCobranca}${query ? '?' + query : ''}`;

    const { ok, dados } = await requisicaoAutenticada(url);

    if (!ok) {
        return {
            sucesso: false,
            mensagem: dados.error || 'Erro ao consultar pagamento.'
        };
    }

    return {
        sucesso: true,
        pago: dados.pago,
        status: dados.status,
        valor: dados.valor,
        pago_em: dados.pago_em
    };
}



export async function perguntarVeritas(pergunta, historico) {
    const { ok, dados } = await requisicaoAutenticada('/ai/veritas', {
        method: 'POST',
        body: JSON.stringify({
            pergunta,
            historico: historico || []
        })
    });

    if (!ok) {
        return {
            sucesso: false,
            mensagem: dados.error || 'Erro ao consultar a Veritas.'
        };
    }

    return {
        sucesso: true,
        resposta: dados.resposta || '',
        acao_proposta: dados.acao_proposta || null
    };
}