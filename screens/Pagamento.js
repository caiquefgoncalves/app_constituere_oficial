import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../components/Header";
import CardValores from "../components/CardValores";
import CardPagamento from "../components/CardPagamento";
import { buscarPagamentos } from "../services/clienteServices";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export default function Pagamento({ navigation }) {
    const [filtro, setFiltro] = useState("aberto");
    const [pagamentos, setPagamentos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const carregar = useCallback(async () => {
        setCarregando(true);

        const resultado = await buscarPagamentos();

        if (resultado.sucesso) {
            setPagamentos(resultado.pagamentos);
        }

        setCarregando(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [carregar])
    );

    useAutoRefresh(carregar, ["processo", "notificacao"]);

    const vencidos = pagamentos.filter((p) => p.status === "Atrasada");
    const emAberto = pagamentos.filter((p) => p.status === "A pagar");
    const pagos = pagamentos.filter((p) => p.status === "Paga");

    const totalVencido = vencidos.reduce((s, p) => s + Number(p.valor || 0), 0);
    const totalEmAberto = emAberto.reduce((s, p) => s + Number(p.valor || 0), 0);
    const totalPago = pagos.reduce((s, p) => s + Number(p.valor || 0), 0);

    const resumoPagamentos = [
        { id: 1, titulo: "Vencido", valor: formatarDinheiro(totalVencido) },
        { id: 2, titulo: "Em aberto", valor: formatarDinheiro(totalEmAberto) },
        { id: 3, titulo: "Pago", valor: formatarDinheiro(totalPago) }
    ];

    const pagamentosFiltrados = pagamentos.filter((item) => {
        if (filtro === "vencido") return item.status === "Atrasada";
        if (filtro === "aberto") return item.status === "A pagar";
        if (filtro === "pagos") return item.status === "Paga";
        return true;
    });

    function statusParaCard(status) {
        if (status === "Atrasada") return "vencido";
        if (status === "A pagar") return "aberto";
        if (status === "Paga") return "pago";
        return status;
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.titulo}>Pagamentos</Text>
                    <Text style={styles.subtitulo}>
                        Acompanhe seus pagamentos e cobranças
                    </Text>
                </View>

                <ScrollView
                    horizontal={true}
                    contentContainerStyle={styles.resumo}
                    showsHorizontalScrollIndicator={false}
                >
                    {resumoPagamentos.map((item) => (
                        <CardValores
                            key={item.id}
                            valor={item.valor}
                            titulo={item.titulo}
                        />
                    ))}
                </ScrollView>

                <View style={styles.abas}>
                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("vencido")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "vencido" && styles.abaAtiva
                            ]}
                        >
                            Vencido
                        </Text>
                        {filtro === "vencido" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("aberto")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "aberto" && styles.abaAtiva
                            ]}
                        >
                            A Vencer
                        </Text>
                        {filtro === "aberto" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.aba}
                        onPress={() => setFiltro("pagos")}
                    >
                        <Text
                            style={[
                                styles.textoAba,
                                filtro === "pagos" && styles.abaAtiva
                            ]}
                        >
                            Pagos
                        </Text>
                        {filtro === "pagos" && <View style={styles.linhaAtiva} />}
                    </TouchableOpacity>
                </View>

                {carregando ? (
                    <ActivityIndicator size="large" color="#0047AB" />
                ) : pagamentosFiltrados.length === 0 ? (
                    <Text style={styles.vazio}>Nenhum pagamento encontrado.</Text>
                ) : (
                    <View style={styles.listaPagamentos}>
                        {pagamentosFiltrados.map((item) => (
                            <CardPagamento
                                key={item.id}
                                titulo={item.nome}
                                valor={formatarDinheiro(item.valor)}
                                status={statusParaCard(item.status)}
                                data={item.vencimento}
                                navigation={navigation}
                                pagamento={item}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flex: 1, width: "100%" },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        gap: 20,
        paddingBottom: 120
    },
    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000"
    },
    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3
    },
    resumo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    abas: {
        width: "100%",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E2E2"
    },
    aba: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 10,
        position: "relative"
    },
    textoAba: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#999999"
    },
    abaAtiva: { color: "#0047AB" },
    linhaAtiva: {
        position: "absolute",
        bottom: -1,
        width: "70%",
        height: 3,
        backgroundColor: "#0047AB",
        borderRadius: 3
    },
    listaPagamentos: { width: "100%", gap: 12 },
    vazio: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#888888",
        textAlign: "center",
        marginTop: 20
    }
});