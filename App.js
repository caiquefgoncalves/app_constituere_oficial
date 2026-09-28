import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import Home from "./screens/Home";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import Pagamento from "./screens/Pagamento";
import {Inter_400Regular, Inter_400Regular_Italic, Inter_700Bold, Inter_800ExtraBold, Inter_900Black, useFonts} from "@expo-google-fonts/inter";

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
import {Image, View} from "react-native";
import Reunioes from "./screens/Reunioes";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: '#0047AB',
                tabBarInactiveTintColor: '#5987c8',

                tabBarStyle: {
                    position: 'absolute',

                    left: 15,
                    right: 15,
                    bottom: 0,

                    height: 90,

                    backgroundColor: '#FFFFFF',

                    borderRadius: 22,
                    borderTopWidth: 0,

                    paddingTop: 8,

                    elevation: 8,

                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.12,
                    shadowRadius: 10,
                },

                tabBarLabelStyle: {
                    fontFamily: "Inter_500Regular",
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

                    if (route.name === 'Dashboard') {
                        imagemOrigem = focused
                            ? iconeHomeAtivo
                            : iconeHomeInativo;

                    } else if (route.name === 'Pagamentos') {
                        imagemOrigem = focused
                            ? iconePagamentoAtivo
                            : iconePagamentoInativo;

                    } else if (route.name === 'Reunioes') {
                        imagemOrigem = focused
                            ? iconeReunioesAtivo
                            : iconeReunioesInativo;

                    } else if (route.name === 'Processos') {
                        imagemOrigem = focused
                            ? iconeProcessoAtivo
                            : iconeProcessoInativo;

                    } else if (route.name === 'Perfil') {
                        imagemOrigem = focused
                            ? iconePerfilAtivo
                            : iconePerfilInativo;
                    }

                    return (
                        <View
                            style={{
                                width: 45,
                                height: 45,

                                alignItems: 'center',
                                justifyContent: 'center',

                                borderRadius: 14,

                                backgroundColor: focused
                                    ? '#EEF2FF'
                                    : 'transparent',
                            }}
                        >
                            <Image
                                source={imagemOrigem}
                                style={{
                                    width: focused ? 35 : 33,
                                    height: focused ? 35 : 33,
                                    resizeMode: 'contain',
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
                    title: 'Início',
                }}
            />

            <Tab.Screen
                name="Pagamentos"
                component={Pagamento}
                options={{
                    title: 'Pagamentos',
                }}
            />

            <Tab.Screen
                name="Reunioes"
                component={Reunioes}
                options={{
                    title: 'Reuniões',
                }}
            />

            <Tab.Screen
                name="Processos"
                component={Dashboard}
                options={{
                    title: 'Processos',
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Dashboard}
                options={{
                    title: 'Perfil',
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_400Regular_Italic,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Dashboard" component={HomeTabs} />
                <Stack.Screen name="PagamentoAberto" component={Pagamento} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}