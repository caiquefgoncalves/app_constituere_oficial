import React, { useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Input from "../components/Input";
import Botao from "../components/Botao";

function formatarDinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

export default function RealizarPagamento({ navigation, route }) {
    const pagamento = route?.params?.pagamento || null;

    const [formaPagamento, setFormaPagamento] = useState("pix");

    const [numeroCartao, setNumeroCartao] = useState("");
    const [nomeCartao, setNomeCartao] = useState("");
    const [validade, setValidade] = useState("");
    const [cvv, setCvv] = useState("");

    const fatura = {
        id: pagamento?.id,
        vencimento: pagamento?.vencimento || "--",
        nome: pagamento?.nome || "Pagamento",
        valor: formatarDinheiro(pagamento?.valor || 0)
    };

    function pagar() {
        console.log("Pagamento realizado", {
            fatura,
            formaPagamento
        });

        Alert.alert(
            "Pagamento registrado",
            "O comprovante será enviado pelo escritório.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
        );
    }

    function gerarBoleto() {
        Alert.alert(
            "Boleto gerado",
            "O boleto foi enviado para o seu e-mail.",
            [{ text: "OK" }]
        );
    }

    function copiarChavePix() {
        Alert.alert("Pix", "Chave Pix copiada para a área de transferência.");
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />

            <KeyboardAvoidingView style={styles.keyboard}>
                <ScrollView
                    contentContainerStyle={styles.main}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <Text style={styles.titulo}>Realizar pagamento</Text>
                        <Text style={styles.subtitulo}>
                            Confira os dados e escolha a forma de pagamento
                        </Text>
                    </View>

                    <View style={styles.secao}>
                        <Text style={styles.tituloSecao}>Detalhes da fatura</Text>

                        <View style={styles.cardFatura}>
                            <View style={styles.linhaDetalhe}>
                                <Text style={styles.label}>Vencimento</Text>
                                <Text style={styles.valorDetalhe}>
                                    {fatura.vencimento}
                                </Text>
                            </View>

                            <View style={styles.divisoria} />

                            <View style={styles.linhaDetalhe}>
                                <Text style={styles.label}>Nome</Text>
                                <Text style={styles.valorDetalhe}>
                                    {fatura.nome}
                                </Text>
                            </View>

                            <View style={styles.divisoria} />

                            <View style={styles.linhaDetalhe}>
                                <Text style={styles.label}>Valor</Text>
                                <Text style={styles.valorPagamento}>
                                    {fatura.valor}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.secao}>
                        <Text style={styles.tituloSecao}>Forma de pagamento</Text>

                        <View style={styles.formasPagamento}>
                            <TouchableOpacity
                                style={[
                                    styles.forma,
                                    formaPagamento === "pix" && styles.formaSelecionada
                                ]}
                                onPress={() => setFormaPagamento("pix")}
                            >
                                <View
                                    style={[
                                        styles.iconeForma,
                                        formaPagamento === "pix" &&
                                        styles.iconeFormaSelecionada
                                    ]}
                                >
                                    <Ionicons
                                        name="qr-code-outline"
                                        size={25}
                                        color="#0047AB"
                                    />
                                </View>
                                <Text style={styles.nomeForma}>Pix</Text>
                                {formaPagamento === "pix" && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={21}
                                        color="#0047AB"
                                        style={styles.check}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.forma,
                                    formaPagamento === "boleto" && styles.formaSelecionada
                                ]}
                                onPress={() => setFormaPagamento("boleto")}
                            >
                                <View
                                    style={[
                                        styles.iconeForma,
                                        formaPagamento === "boleto" &&
                                        styles.iconeFormaSelecionada
                                    ]}
                                >
                                    <Ionicons
                                        name="barcode-outline"
                                        size={27}
                                        color="#0047AB"
                                    />
                                </View>
                                <Text style={styles.nomeForma}>Boleto</Text>
                                {formaPagamento === "boleto" && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={21}
                                        color="#0047AB"
                                        style={styles.check}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.forma,
                                    formaPagamento === "debito" && styles.formaSelecionada
                                ]}
                                onPress={() => setFormaPagamento("debito")}
                            >
                                <View
                                    style={[
                                        styles.iconeForma,
                                        formaPagamento === "debito" &&
                                        styles.iconeFormaSelecionada
                                    ]}
                                >
                                    <Ionicons
                                        name="card-outline"
                                        size={26}
                                        color="#0047AB"
                                    />
                                </View>
                                <Text style={styles.nomeForma}>Débito</Text>
                                {formaPagamento === "debito" && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={21}
                                        color="#0047AB"
                                        style={styles.check}
                                    />
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.forma,
                                    formaPagamento === "credito" && styles.formaSelecionada
                                ]}
                                onPress={() => setFormaPagamento("credito")}
                            >
                                <View
                                    style={[
                                        styles.iconeForma,
                                        formaPagamento === "credito" &&
                                        styles.iconeFormaSelecionada
                                    ]}
                                >
                                    <Ionicons
                                        name="card-outline"
                                        size={26}
                                        color="#0047AB"
                                    />
                                </View>
                                <Text style={styles.nomeForma}>Crédito</Text>
                                {formaPagamento === "credito" && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={21}
                                        color="#0047AB"
                                        style={styles.check}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formaPagamento === "pix" && (
                        <View style={styles.secao}>
                            <Text style={styles.tituloSecao}>Pagamento via Pix</Text>

                            <View style={styles.cardPagamento}>
                                <View style={styles.areaQrCode}>
                                    <Ionicons
                                        name="qr-code-outline"
                                        size={200}
                                        color="#222222"
                                    />
                                </View>

                                <Text style={styles.instrucao}>
                                    Escaneie o QR Code com o aplicativo do seu banco
                                </Text>

                                <View style={styles.areaChave}>
                                    <Text style={styles.labelChave}>Chave Pix</Text>
                                    <Text style={styles.chave}>AQUI129458734</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.botaoSecundario}
                                    onPress={copiarChavePix}
                                >
                                    <Ionicons
                                        name="copy-outline"
                                        size={18}
                                        color="#0047AB"
                                    />
                                    <Text style={styles.textoBotaoSecundario}>
                                        Copiar chave Pix
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {formaPagamento === "boleto" && (
                        <View style={styles.secao}>
                            <Text style={styles.tituloSecao}>
                                Pagamento por boleto
                            </Text>

                            <View style={styles.cardPagamento}>
                                <View style={styles.iconePagamentoGrande}>
                                    <Ionicons
                                        name="barcode-outline"
                                        size={85}
                                        color="#0047AB"
                                    />
                                </View>

                                <Text style={styles.tituloPagamento}>
                                    Gere seu boleto
                                </Text>

                                <Text style={styles.instrucao}>
                                    Ao selecionar essa opção, o boleto será gerado e
                                    você poderá pagar pela sua conta bancária
                                </Text>
                            </View>
                        </View>
                    )}

                    {(formaPagamento === "debito" ||
                        formaPagamento === "credito") && (
                        <View style={styles.secao}>
                            <Text style={styles.tituloSecao}>Dados do cartão</Text>

                            <View style={styles.cardPagamento}>
                                <Input
                                    label={"Número do cartão"}
                                    valor={numeroCartao}
                                    setValor={setNumeroCartao}
                                    tipo={"numeric"}
                                />

                                <Input
                                    label={"Nome impresso no cartão"}
                                    valor={nomeCartao}
                                    setValor={setNomeCartao}
                                    letraMaiuscula={"characters"}
                                />

                                <View style={styles.linhaCartao}>
                                    <View style={styles.campoMetade}>
                                        <Input
                                            label={"Validade"}
                                            valor={validade}
                                            setValor={setValidade}
                                            tipo={"numeric"}
                                        />
                                    </View>

                                    <View style={styles.campoMetade}>
                                        <Input
                                            label={"CVV"}
                                            valor={cvv}
                                            setValor={setCvv}
                                            tipo={"numeric"}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    <Botao
                        texto={
                            formaPagamento === "pix"
                                ? "Confirmar pagamento"
                                : formaPagamento === "boleto"
                                    ? "Gerar boleto"
                                    : "Pagar agora"
                        }
                        acao={
                            formaPagamento === "boleto" ? gerarBoleto : pagar
                        }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboard: { flex: 1 },
    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        gap: 20
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
    secao: { width: "100%", gap: 10 },
    tituloSecao: {
        fontSize: 18,
        fontFamily: "Inter_800ExtraBold",
        color: "#222222"
    },
    cardFatura: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 16,
        elevation: 3,
        shadowColor: "#000000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    linhaDetalhe: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15
    },
    label: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: "#777777"
    },
    valorDetalhe: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#222222"
    },
    valorPagamento: {
        fontSize: 15,
        fontFamily: "Inter_700Bold",
        color: "#FF4D55"
    },
    divisoria: {
        height: 1,
        backgroundColor: "#EEEEEE"
    },
    formasPagamento: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10
    },
    forma: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        borderRadius: 10,
        padding: 14,
        position: "relative",
        elevation: 1,
        shadowColor: "#000000",
        shadowOpacity: 0.04,
        shadowRadius: 3
    },
    formaSelecionada: {
        backgroundColor: "#EEF5FF",
        borderColor: "#0047AB"
    },
    iconeForma: {
        width: 38,
        height: 38,
        borderRadius: 8,
        backgroundColor: "#EEF5FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },
    iconeFormaSelecionada: {
        backgroundColor: "#DCEAFF"
    },
    nomeForma: {
        fontSize: 14,
        fontFamily: "Inter_700Bold",
        color: "#222222"
    },
    check: {
        position: "absolute",
        top: 10,
        right: 10
    },
    cardPagamento: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 18,
        gap: 18,
        elevation: 2,
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 }
    },
    areaQrCode: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
    },
    instrucao: {
        fontSize: 13,
        lineHeight: 19,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        textAlign: "center"
    },
    areaChave: {
        backgroundColor: "#F7F7F7",
        borderRadius: 8,
        padding: 12,
        alignItems: "center"
    },
    labelChave: {
        fontSize: 11,
        fontFamily: "Inter_400Regular",
        color: "#888888"
    },
    chave: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#222222",
        marginTop: 3
    },
    iconePagamentoGrande: {
        width: 100,
        height: 100,
        borderRadius: 43,
        backgroundColor: "#EEF5FF",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    tituloPagamento: {
        fontSize: 16,
        fontFamily: "Inter_700Bold",
        color: "#222222",
        textAlign: "center"
    },
    botaoSecundario: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: "#0047AB",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        backgroundColor: "#FFFFFF"
    },
    textoBotaoSecundario: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#0047AB"
    },
    linhaCartao: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12
    },
    campoMetade: { flex: 1 }
});