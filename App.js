import React, { useEffect, useState } from "react";

import {
    Image,
    View
} from "react-native";

import {
    NavigationContainer
} from "@react-navigation/native";

import {
    createNativeStackNavigator
} from "@react-navigation/native-stack";

import {
    createBottomTabNavigator
} from "@react-navigation/bottom-tabs";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    Inter_400Regular,
    Inter_400Regular_Italic,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    useFonts
} from "@expo-google-fonts/inter";

import { SocketProvider } from "./context/SocketContext";

import Home from "./screens/Home";
import Login from "./screens/Login";
import PrimeiroLogin from "./screens/PrimeiroLogin";

import Dashboard from "./screens/Dashboard";

import Pagamento from "./screens/Pagamento";
import RealizarPagamento from "./screens/RealizarPagamento";

import Reunioes from "./screens/Reunioes";
import AgendarReuniao from "./screens/AgendarReuniao";
import ReagendarReuniao from "./screens/ReagendarReuniao";

import Processos from "./screens/Processos";

import Perfil from "./screens/Perfil";
import EditarPerfil from "./screens/EditarPerfil";
import RedefinirSenha from "./screens/RedefinirSenha";

import Notificacoes from "./screens/Notificacoes";

import iconeHomeAtivo from "./assets/iconeHomeAtivo.png";
import iconeHomeInativo from "./assets/iconeHomeInativo.png";

import iconePagamentoAtivo from "./assets/iconePagamentoAtivo.png";
import iconePagamentoInativo from "./assets/iconePagamentoInativo.png";

import iconePerfilAtivo from "./assets/iconePerfilAtivo.png";
import iconePerfilInativo from "./assets/iconePerfilInativo.png";

import iconeProcessoAtivo from "./assets/iconeProcessoAtivo.png";
import iconeProcessoInativo from "./assets/iconeProcessoInativo.png";

import iconeReunioesAtivo from "./assets/iconeReunioesAtivo.png";
import iconeReunioesInativo from "./assets/iconeReunioesInativo.png";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const PagamentoStack = createNativeStackNavigator();
const ReunioesStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();

function PagamentoNavigator() {
    return (
        <PagamentoStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <PagamentoStack.Screen
                name="PagamentosInicio"
                component={Pagamento}
            />
            <PagamentoStack.Screen
                name="RealizarPagamento"
                component={RealizarPagamento}
            />
        </PagamentoStack.Navigator>
    );
}

function ReunioesNavigator() {
    return (
        <ReunioesStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <ReunioesStack.Screen
                name="ReunioesInicio"
                component={Reunioes}
            />
            <ReunioesStack.Screen
                name="AgendarReuniao"
                component={AgendarReuniao}
            />
            <ReunioesStack.Screen
                name="ReagendarReuniao"
                component={ReagendarReuniao}
            />
        </ReunioesStack.Navigator>
    );
}

function PerfilNavigator() {
    return (
        <PerfilStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <PerfilStack.Screen
                name="PerfilInicio"
                component={Perfil}
            />
            <PerfilStack.Screen
                name="EditarPerfil"
                component={EditarPerfil}
            />
            <PerfilStack.Screen
                name="RedefinirSenha"
                component={RedefinirSenha}
            />
        </PerfilStack.Navigator>
    );
}

function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#0047AB",
                tabBarInactiveTintColor: "#5987C8",
                tabBarStyle: {
                    position: "absolute",
                    left: 15,
                    right: 15,
                    bottom: 0,
                    height: 120,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 22,
                    borderTopWidth: 0,
                    paddingTop: 8,
                    elevation: 8,
                    shadowColor: "#000000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.12,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: "Inter_400Regular",
                    fontSize: 13,
                    marginTop: 8,
                },
                tabBarIconStyle: {
                    marginTop: 0,
                },
                tabBarShowLabel: true,
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused }) => {
                    let imagemOrigem;

                    if (route.name === "Dashboard") {
                        imagemOrigem = focused
                            ? iconeHomeAtivo
                            : iconeHomeInativo;
                    }
                    else if (route.name === "Pagamentos") {
                        imagemOrigem = focused
                            ? iconePagamentoAtivo
                            : iconePagamentoInativo;
                    }
                    else if (route.name === "Reunioes") {
                        imagemOrigem = focused
                            ? iconeReunioesAtivo
                            : iconeReunioesInativo;
                    }
                    else if (route.name === "Processos") {
                        imagemOrigem = focused
                            ? iconeProcessoAtivo
                            : iconeProcessoInativo;
                    }
                    else if (route.name === "Perfil") {
                        imagemOrigem = focused
                            ? iconePerfilAtivo
                            : iconePerfilInativo;
                    }

                    return (
                        <View
                            style={{
                                width: 45,
                                height: 45,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 14,
                                backgroundColor: focused
                                    ? "#EEF2FF"
                                    : "transparent",
                            }}
                        >
                            <Image
                                source={imagemOrigem}
                                style={{
                                    width: focused
                                        ? 35
                                        : 33,
                                    height: focused
                                        ? 35
                                        : 33,
                                    resizeMode: "contain",
                                }}
                            />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    title: "Início",
                }}
            />
            <Tab.Screen
                name="Pagamentos"
                component={PagamentoNavigator}
                options={{
                    title: "Pagamentos",
                }}
            />
            <Tab.Screen
                name="Reunioes"
                component={ReunioesNavigator}
                options={{
                    title: "Reuniões",
                }}
            />
            <Tab.Screen
                name="Processos"
                component={Processos}
                options={{
                    title: "Processos",
                }}
            />
            <Tab.Screen
                name="Perfil"
                component={PerfilNavigator}
                options={{
                    title: "Perfil",
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [idUsuario, setIdUsuario] = useState(null);

    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_400Regular_Italic,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    useEffect(() => {
        async function carregarIdUsuario() {
            const id = await AsyncStorage.getItem("id_usuario");
            if (id) setIdUsuario(parseInt(id, 10));
        }
        carregarIdUsuario();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SocketProvider idUsuario={idUsuario}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                    initialRouteName="Home"
                >
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                    />
                    <Stack.Screen
                        name="PrimeiroLogin"
                        component={PrimeiroLogin}
                    />
                    <Stack.Screen
                        name="Principal"
                        component={HomeTabs}
                    />
                    <Stack.Screen
                        name="Notificacoes"
                        component={Notificacoes}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SocketProvider>
    );
}