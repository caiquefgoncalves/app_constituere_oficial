const API_URL = 'http://192.168.0.129:5000';

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

export { API_URL };