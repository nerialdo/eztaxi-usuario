import React from "react";

import { StyleSheet, View, ActivityIndicator, Text, Platform } from "react-native";

import { Avatar, Center} from "native-base";

import {useAuth} from "../contexts/auth";

import AuthRoutes from "./auth.routes";

import AppRoutes from "./app.routes";

// import TipoUsuario from "./tipousuario.routes";

// import AlertMsg from "../componets/AlertMsg";

import Stagger from "../componets/Stagger";

import CorridaAberta from "../pages/CorridaAberta";

import Perfil from "../pages/Perfil";

// import AlertStatusPedido from "../componets/AlertStatusPedido";

// import FabMsg from "../componets/FabMsg";


const Routes = () => {
    const { 
        signed, 
        loading, 
        novaOrder, 
        aceite, 
        orderStatus, 
        limparOrderStatus, 
        novaMsg,
        completarPerfil
    } = useAuth()
    console.log("loading page Routes", signed, loading, novaOrder, aceite, orderStatus)
    // console.log("loading page Routes", signed, loading, novaOrder, aceite, orderStatus)
    // console.log("loading page Routes", signed, loading, novaOrder)
    // alert('signed ' + signed.toString() + ' loading ' + loading.toString())
    if(loading){
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#666" />
            </View>
        )
    }

    if(completarPerfil){
        return (
            <Perfil />
        )
    }

    if(novaOrder){
        return (
            <View style={styles.container}>
                {/* {novaMsg && (
                    <View style={styles.InfoGeralTop}>
                        <AlertMsg novaMsg={novaMsg} />
                    </View>
                )} */}
                
                <CorridaAberta />
            </View>
        )
    }

    return signed ? 
        <>
        <AppRoutes />

        <View style={styles.MenuStagger}>
            <Stagger />
        </View>
        <View style={styles.InfoGeral}>
            {/* <Stagger /> */}
        </View>
        </> 
        : 
        <AuthRoutes />;
}

export default Routes;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    InfoGeralTop: {
        position: 'absolute',
        top: Platform.select({ ios: 40, android: 20 }),
        // padding: 15,
        left: 0,
        width: '100%',
        zIndex: 99999
    },
    InfoGeral: {
        position: 'absolute',
        bottom: 0,
        padding: 15,
        left: 0,
        width: '100%',
    },
    MenuStagger: {
        position: 'absolute',
        bottom: 0,
        padding: 15,
        right: 0,
        // width: '100%',
        alignItems: 'flex-end'
    },
});