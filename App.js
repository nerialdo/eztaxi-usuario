// import { StatusBar } from 'expo-status-bar';
// import 'expo-dev-client';
import React, { useEffect, useState, useRef, useCallback} from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {AuthProvider} from './src/contexts/auth';
import Entypo from '@expo/vector-icons/Entypo';
import { extendTheme, NativeBaseProvider } from 'native-base';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import Routes from './src/routes';

const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};

const theme = extendTheme({ colors: newColorTheme });

export default function App() {

  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pré-carregue as fontes, faça todas as chamadas de API necessárias aqui
        await Font.loadAsync(Entypo.font);
        // Atrasar artificialmente por dois segundos para simular um carregamento lento
        // experience. Please remove this if you copy and paste the code!
        // await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  // useEffect(() => {
  //   console.log('===>', AppState.currentState)
  //   const subscription = AppState.addEventListener("change", _handleAppStateChange);
  //   // const subscriptionBlur = AppState.addEventListener("blur", _handleAppStateChange);
  //   return () => {
  //       subscription?.remove();
  //       // subscriptionBlur.remove();
  //   };
  // }, []);

  // const _handleAppStateChange = nextAppState => {
  //     if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
  //         console.log('App has come to the foreground!');
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     console.log('AppState', appState.current);

  // };

  return (
    // <NativeBaseProvider>
    //   <Text>Hello world</Text>
    // </NativeBaseProvider>
    <NativeBaseProvider theme={theme} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
        </AuthProvider>  
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
// import React from "react";
// import { NativeBaseProvider, Box } from "native-base";

// export default function App() {
//   return (
//     <NativeBaseProvider>
//       <Box>Hello world</Box>
//     </NativeBaseProvider>
//   );
// }