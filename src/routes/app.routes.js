import React from "react";
import Dashboard from "../pages/Dashboard";
import Perfil from "../pages/Perfil";
import Historico from "../pages/Historico";
import Chats from "../pages/Chats";
// import Extrato from "../pages/Extrato";
import Checkout from "../pages/Checkout";
import Confirmacao from "../pages/Confirmacao";
import Chat from "../pages/Chat";
import Avaliacao from "../pages/Avaliacao";
import { Button, Icon } from "native-base";
import { Ionicons } from "@expo/vector-icons"

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AppStack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();

const AppRoutes = () => (
    <AppStack.Navigator 
        initialRouteName="Dashboard"
        screenOptions={{
            headerMode: 'screen',
            headerTintColor: 'black',
            headerStyle: { backgroundColor: 'transparent' },
        }}
    >
        <AppStack.Screen
            name="Dashboard" 
            component={Dashboard} 
            options={() => ({
                headerShown:false,
            })}
        />
        <AppStack.Screen
            name="Perfil" 
            component={Perfil} 
            // options={({ navigation }) => ({
            //     headerBackTitleVisible: false,
            //     headerRight: () => (
            //         <Button
            //             onPress={() => navigation.navigate('Perfil')}
            //             colorScheme="primary"
            //             variant="ghost"
            //             _text={{
            //                 color: "#047857",
            //             }}
            //             leftIcon={
            //                 <Icon as={Ionicons} name="person-circle-outline" size="sm" />
            //             }
            //         >
            //         </Button>
            //     )
            // })}
        />
        <AppStack.Screen
            name="Histórico" 
            component={Historico} 
            options={({ navigation }) => ({
                headerBackTitleVisible: false,
                headerRight: () => (
                    <Button
                        onPress={() => navigation.navigate('Perfil')}
                        colorScheme="primary"
                        variant="ghost"
                        _text={{
                            color: "#047857",
                        }}
                        leftIcon={
                            <Icon as={Ionicons} name="person-circle-outline" size="sm" />
                        }
                    >
                    </Button>
                )
            })}
        />
        <AppStack.Screen
            name="Conversas" 
            component={Chats} 
            options={({ navigation }) => ({
                headerBackTitleVisible: false,
                headerRight: () => (
                    <Button
                        onPress={() => navigation.navigate('Perfil')}
                        colorScheme="primary"
                        variant="ghost"
                        _text={{
                            color: "#047857",
                        }}
                        leftIcon={
                            <Icon as={Ionicons} name="person-circle-outline" size="sm" />
                        }
                    >
                    </Button>
                )
            })}
        />
        <AppStack.Screen
            name="Avaliacao" 
            component={Avaliacao} 
            // options={({ navigation }) => console.log('nav ', navigation)}
            options={({ navigation }) => ({
                headerShown:false,
            })}
        />
        {/* <AppStack.Screen
            name="Extrato" 
            component={Extrato} 
            options={({ navigation }) => ({
                headerRight: () => (
                    <Button
                        onPress={() => navigation.navigate('Perfil')}
                        colorScheme="primary"
                        variant="ghost"
                        _text={{
                            color: "#047857",
                        }}
                        leftIcon={
                            <Icon as={Ionicons} name="person-circle-outline" size="sm" />
                        }
                    >
                    </Button>
                )
            })}
        /> */}
        <AppStack.Screen
            name="Checkout" 
            component={Checkout} 
            options={({ navigation }) => ({
                headerTitle: 'Checkout',
                headerRight: () => (
                    <Button
                        onPress={() => navigation.navigate('Perfil')}
                        colorScheme="primary"
                        variant="ghost"
                        _text={{
                            color: "#047857",
                        }}
                        leftIcon={
                            <Icon as={Ionicons} name="person-circle-outline" size="sm" />
                        }
                    >
                    </Button>
                )
            })}
        />
        <AppStack.Screen
            name="Chat" 
            component={Chat} 
            options={({ navigation }) => ({
                headerTitle: 'Chat',
                headerBackTitleVisible: false
                // headerRight: () => (
                //     <Button
                //         onPress={() => navigation.navigate('Perfil')}
                //         colorScheme="primary"
                //         variant="ghost"
                //         _text={{
                //             color: "#047857",
                //         }}
                //         leftIcon={
                //             <Icon as={Ionicons} name="person-circle-outline" size="sm" />
                //         }
                //     >
                //     </Button>
                // )
            })}
        />
        <AppStack.Screen
            name="Confirmacao" 
            component={Confirmacao} 
            options={({ navigation }) => ({
                headerShown:false,
            })}
        />
    </AppStack.Navigator>
);

export default AppRoutes