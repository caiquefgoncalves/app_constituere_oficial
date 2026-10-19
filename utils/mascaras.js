
export const apenasNumeros = (v) => (v || "").replace(/\D/g, "");

export function mascaraData(v) {
    const n = apenasNumeros(v).slice(0, 8);
    if (n.length > 4) return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
    if (n.length > 2) return `${n.slice(0, 2)}/${n.slice(2)}`;
    return n;
}

export function mascaraCPF(v) {
    const n = apenasNumeros(v).slice(0, 11);
    if (n.length > 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    if (n.length > 6) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
    if (n.length > 3) return `${n.slice(0, 3)}.${n.slice(3)}`;
    return n;
}

export function mascaraCNPJ(v) {
    const n = apenasNumeros(v).slice(0, 14);
    if (n.length > 12) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12)}`;
    if (n.length > 8) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8)}`;
    if (n.length > 5) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;
    if (n.length > 2) return `${n.slice(0, 2)}.${n.slice(2)}`;
    return n;
}

export function mascaraRG(v) {
    // RG aceita dígito verificador "X" no final
    const n = (v || "").replace(/[^0-9xX]/g, "").toUpperCase().slice(0, 9);
    if (n.length > 8) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}-${n.slice(8)}`;
    if (n.length > 5) return `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5)}`;
    if (n.length > 2) return `${n.slice(0, 2)}.${n.slice(2)}`;
    return n;
}

export function mascaraCEP(v) {
    const n = apenasNumeros(v).slice(0, 8);
    if (n.length > 5) return `${n.slice(0, 5)}-${n.slice(5)}`;
    return n;
}

export function mascaraTelefone(v) {
    const n = apenasNumeros(v).slice(0, 11);
    if (n.length > 10) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
    if (n.length > 6) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
    if (n.length > 2) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    if (n.length > 0) return `(${n}`;
    return "";
}

export function mascaraCPFouCNPJ(v) {
    return apenasNumeros(v).length > 11 ? mascaraCNPJ(v) : mascaraCPF(v);
}

export function limparMascaras(campos) {
    const limpo = { ...campos };
    ["cpf", "cnpj", "cep", "telefone"].forEach((k) => {
        if (typeof limpo[k] === "string") limpo[k] = apenasNumeros(limpo[k]);
    });
    if (typeof limpo.rg === "string") {
        limpo.rg = limpo.rg.replace(/[^0-9xX]/g, "").toUpperCase();
    }
    if (typeof limpo.data_nascimento === "string") {
        limpo.data_nascimento = dataParaApi(limpo.data_nascimento);
    }
    return limpo;
}

export function dataParaTela(v) {
    if (!v) return "";
    const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    return mascaraData(v);
}

export function dataParaApi(v) {
    if (!v) return "";
    const m = String(v).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;
    return v;
}