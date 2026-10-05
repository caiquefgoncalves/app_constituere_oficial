import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing
} from "react-native";


export default function Carregando({
                                    carregando,
                                    texto = "Carregando..."
                                }) {

    const [rotacao] = useState(
        new Animated.Value(0)
    );


    useEffect(() => {

        if (carregando) {

            rotacao.setValue(0);

            Animated.loop(

                Animated.timing(rotacao, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.linear,
                    useNativeDriver: true
                })

            ).start();

        }

    }, [carregando]);


    const girar = rotacao.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });


    if (!carregando) {
        return null;
    }


    return (

        <View style={styles.overlay}>

            <View style={styles.card}>

                <Animated.Image
                    source={require("../assets/martelinho.png")}
                    style={[
                        styles.martelo,
                        {
                            transform: [
                                {
                                    rotate: girar
                                }
                            ]
                        }
                    ]}
                />


                <Text style={styles.texto}>
                    {texto}
                </Text>

                <Text style={styles.subtexto}>
                    Aguarde um instante
                </Text>

            </View>

        </View>

    );
}



const styles = StyleSheet.create({

    overlay: {
        position: "absolute",

        top: 0,
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: "rgba(0, 0, 0, 0.25)",

        alignItems: "center",
        justifyContent: "center",

        zIndex: 999,
        elevation: 999,
    },


    card: {
        width: "75%",

        backgroundColor: "#FFFFFF",

        borderRadius: 15,

        paddingVertical: 30,
        paddingHorizontal: 20,

        alignItems: "center",

        elevation: 5,

        shadowColor: "#000000",
        shadowOpacity: 0.12,
        shadowRadius: 8,

        shadowOffset: {
            width: 0,
            height: 3
        },
    },


    martelo: {
        width: 70,
        height: 70,

        resizeMode: "contain",

        marginBottom: 18,
    },


    texto: {
        fontSize: 18,

        fontFamily: "Inter_700Bold",

        color: "#0047AB",

        textAlign: "center",
    },


    subtexto: {
        fontSize: 13,

        fontFamily: "Inter_400Regular",

        color: "#777777",

        marginTop: 5,
    },

});