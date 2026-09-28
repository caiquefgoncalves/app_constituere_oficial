import React from "react";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import CardProcesso from "../components/CardProcesso";


export default function Processos({ navigation }) {

    const processos = [
        {
            id: 1,
            numero: "0000001-00.2026.8.26.0000",
            advogados: "Dr. Carlos Mendes",
            tipo: "Ação Trabalhista",
            status: "Em andamento"
        },

        {
            id: 2,
            numero: "0000002-00.2026.8.26.0000",
            advogados: "Dra. Mariana Alves e Dr. Rafael Souza",
            tipo: "Ação Cível",
            status: "Em andamento"
        },

        {
            id: 3,
            numero: "0000003-00.2025.8.26.0000",
            advogados: "Dra. Fernanda Oliveira",
            tipo: "Direito de Família",
            status: "Concluído"
        }
    ];


    return (
        <View style={styles.container}>

            <Header navigation={navigation} />


            <ScrollView
                contentContainerStyle={styles.main}
                showsVerticalScrollIndicator={false}
            >

                <View>

                    <Text style={styles.titulo}>
                        Processos
                    </Text>

                    <Text style={styles.subtitulo}>
                        Acompanhe seus processos e seus principais detalhes
                    </Text>

                </View>


                <View style={styles.lista}>

                    {processos.map((item) => (

                        <CardProcesso
                            id={item.id}
                            status={item.status}
                            numero={item.numero}
                            advogados={item.advogados}
                            tipo={item.tipo}
                        />

                    ))}

                </View>

            </ScrollView>

        </View>
    );
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
    },


    main: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        paddingBottom: 120,
        gap: 20,
    },



    titulo: {
        fontSize: 25,
        fontFamily: "Inter_700Bold",
        color: "#000000",
    },

    subtitulo: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: "#666666",
        marginTop: 3,
    },


    lista: {
        width: "100%",
        gap: 15,
    },
});