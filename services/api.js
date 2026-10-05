import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.92.11.20:5000';

export async function requisicao(caminho, opcoes = {}) {
    const url = `${API_URL}${caminho}`;

    const resposta = await fetch(url, {
        ...opcoes,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(opcoes.headers || {})
        }
    });

    let dados = {};

    try {
        dados = await resposta.json();
    } catch {
        dados = {};
    }

    return { ok: resposta.ok, status: resposta.status, dados };
}

export async function requisicaoAutenticada(caminho, opcoes = {}) {
    const token = await AsyncStorage.getItem('token');

    return requisicao(caminho, {
        ...opcoes,
        headers: {
            ...(opcoes.headers || {}),
            'X-Access-Token': token
        }
    });
}

export { API_URL };