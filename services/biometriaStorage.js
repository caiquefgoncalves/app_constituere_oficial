import AsyncStorage from '@react-native-async-storage/async-storage';

function chave(idUsuario) {
    return `biometria_ativa_${idUsuario}`;
}

export async function ativarBiometria(idUsuario) {
    if (!idUsuario) return;
    await AsyncStorage.setItem(chave(idUsuario), 'true');
}

export async function desativarBiometria(idUsuario) {
    if (!idUsuario) return;
    await AsyncStorage.removeItem(chave(idUsuario));
}

export async function biometriaAtiva(idUsuario) {
    if (!idUsuario) return false;
    const valor = await AsyncStorage.getItem(chave(idUsuario));
    return valor === 'true';
}