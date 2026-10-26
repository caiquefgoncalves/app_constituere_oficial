import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const API_URL = 'http://10.92.11.21:5000';
const ORIGEM_DISPOSITIVO = Device.deviceName || Device.modelName || 'Celular (Expo)';

export async function requisicao(caminho, opcoes = {}) {
    const url = `${API_URL}${caminho}`;

    const resposta = await fetch(url, {
        ...opcoes,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-Client-Platform': 'expo-mobile',
            'X-Client-Device': ORIGEM_DISPOSITIVO,
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

export { API_URL, ORIGEM_DISPOSITIVO };
