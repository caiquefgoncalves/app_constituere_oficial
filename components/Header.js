import {Image, StyleSheet, TouchableOpacity, View} from "react-native";

export default function Header({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image style={styles.logo} source={require('../assets/logoMaior.png')} />
                <TouchableOpacity>
                    <Image style={styles.notificacao} source={require('../assets/notificacao.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 140,
        backgroundColor: "#2A2929",
        width: "100%",
        paddingHorizontal: 40,
        justifyContent: "flex-end"

    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 15
    },

    logo: {
        width: 200,
        height: 70,
    },
    notificacao: {
        width: 35,
        height: 35,
    }
})