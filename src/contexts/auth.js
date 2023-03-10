import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { Alert, Vibration, Platform } from "react-native";
// import { useToast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
// import api from '../services/api' 
import * as authen from '../services/auth' ;
import * as Location from 'expo-location';
import { ResponseType } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { discovery } from "expo-auth-session/providers/google";
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signOut, 
    onAuthStateChanged, 
    signInWithCredential, 
    signInWithEmailAndPassword ,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    OAuthProvider,
    PhoneAuthProvider,
    signInAnonymously,
    signInWithCustomToken
} from 'firebase/auth';
import { Firestore, 
    collection, query, where, getDocs, getFirestore, addDoc, setDoc, 
    doc, deleteDoc, onSnapshot, orderBy, updateDoc, arrayUnion, Timestamp, limit,
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { getDatabase, onValue} from "firebase/database";

import { async } from "@firebase/util";
import Geocoder from 'react-native-geocoding';
import { useNavigation } from '@react-navigation/native';

import { GiftedChat } from 'react-native-gifted-chat';

// import { Audio } from 'expo-av';
import aud from "../../assets/notificacoes/sound1.wav"
import { AlertDialog } from "native-base";

const firebaseConfig = {
    apiKey: "AIzaSyD3vi63BxmzuxWXrpu_zUMUAwQDD2NoD_w",
    authDomain: "extaxi-50c37.firebaseapp.com",
    projectId: "extaxi-50c37",
    storageBucket: "extaxi-50c37.appspot.com",
    messagingSenderId: "1054676875897",
    appId: "1:1054676875897:web:84bf9db316ba5f444fb2a8",
    measurementId: "G-P3KQXDD07P"
};

WebBrowser.maybeCompleteAuthSession();
Geocoder.init("AIzaSyAQAGqFeeThBCPGZznbTg6QpcutU1nrDXA"); 


// br.com.eztaxi
// 95:62:CB:1F:84:60:E4:1E:E3:78:72:D1:46:35:83:5D:55:61:27:D2

// const firebaseConfig = {
//     apiKey: "AIzaSyBNGkmf5kWpFb_w6xFzqAEhOCQC5ND5IUk",
//     authDomain: "whatsapp-82efa.firebaseapp.com",
//     databaseURL: "https://whatsapp-82efa.firebaseio.com",
//     projectId: "whatsapp-82efa",
//     storageBucket: "whatsapp-82efa.appspot.com",
//     messagingSenderId: "1056876714892",
//     appId: "1:1056876714892:web:3dcb8a67476a505938d4a9"
// };



if(firebaseConfig){
  initializeApp(firebaseConfig);
}
    

const AuthContext = createContext({});

// const auth = getAuth();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});
  
    
export const AuthProvider = ({children}) => { 
    // console.log('childrenchildren', children)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadi, setLoadi] = useState(false)
    // const [usuarioDefinido, setUsuarioDefinido] = useState(null)
    const [motoristaLivre, setMotoristaLivre] = useState([])
    const [localizacaoMotorista, setLocalizacaoMotorista] = useState(null)
    const [semMotorista, setSemMotorista] = useState(true)
    // const provider = new GoogleAuthProvider();
    // const auth = getAuth();
    const db = getFirestore();

    // const provider = new OAuthProvider('apple.com');
    // provider.addScope('email');
    // provider.addScope('name');
    // provider.setCustomParameters({
    //     // Localize the Apple authentication screen in French.
    //     locale: 'fr'
    // });


    const [region, setRegion] = useState(null)
    const [destination, setDestination] = useState(null);
    const [location, setLocation] = useState(null);
    const [yourLocation, setYourLocation] = useState(null);
    const [cidadeEstado, setCidadeEstado] = useState(null);
    const [idTransacao, setIdTransacao] = useState(null);
    const [aceite, setAceite] = useState('aguardando');

    const [novaOrder, setNovaOrder] = useState(null)
    // const [infoCorrida, setInfoCorrida] = useState(null);

    const [historico, setHistorico] = useState(null);
    const [chats, setChats] = useState(null);
    const [novaMsg, setNovaMsg] = useState(false);

    const navigation = useNavigation();

    const [messages, setMessages] = useState([]);

    const [orderStatus, setOrderStatus] = useState(null);


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [completarPerfil, setCompletarPerfil] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [sound, setSound] = useState();

    const [imagePerfil, setImagePerfil] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [primeiraCorrida, setPrimeiraCorrida] = useState(false)
    const [config, setConfig] = useState(null)
    const [mudarLocalizacao, setMudarLocalizacao] = useState(null)

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
          clientId: '741352224001-9b8pjmsf756mtitpjdfes7092310ar0j.apps.googleusercontent.com',
        },
    );


    const [ selected, setSelected ] = useState(null)
    const [ valor, setValor ] = useState(null)
    const [ valorSemBonus, setValorSemBonus ] = useState(null)
    const [ valorBonus, setValorBonus ] = useState(20)
    const [showCountdown, setShowCountdown] = useState(true);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         carregarLocalizazao()
    //     }, 60 * 1000);
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        // carregarLocalizazao()
        if (response?.type === 'success') {
          const { id_token } = response.params;
          console.log('aaaa', id_token)
          const auth = getAuth();
          console.log('aaaa auth', auth)
          const credential = GoogleAuthProvider.credential(id_token);
          console.log('aaaa credential', credential)
          const res = signInWithCredential(auth, credential);
          console.log('aaaa res', res)
        }
      }, [response]);

    // Ouvintes de notifica????es

    useEffect(() => {
        // console.log('new Date(Timestamp.now().seconds*1000).toLocaleDateString()', new Date(Timestamp.now().seconds*1000).toLocaleDateString())
        // if (Platform.OS === 'android') {
            registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        // }

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log("response notification ",  response);
            Alert.alert(
                "Nova mensagem",
                "Recebendo nova mensagem",
                [
                //   {
                //     text: "Cancel",
                //     onPress: () => console.log("Cancel Pressed"),
                //     style: "cancel"
                //   },
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        });

        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        setMotoristaLivre([])
    }, [expoPushToken])
    
    useEffect(() => {
        //verificar se usuario est?? definido
        // navigation.navigate('Chat');
        //console.log('1?? Carregamento')
        // schedulePushNotification('ExponentPushToken[Zr8OhHOyZ5tllZtWeTUuOj]', 'Mensagem do passageiro', 'text')
        try {
            verific()
        } catch (error) {
            console.log('error useEffect auth', error)
            alert('Error useEffect auth' + error.toString())
        }

        // return () => verific().abort();
    }, [])

    const chamandoNovoMotorista = async (orderatual, useratual) => {
        setShowCountdown(false)
        console.log(`orderatual`, orderatual)
        var idmotoristaatual = orderatual.data.idMotorista
        var dadocorridaatual = orderatual.data

        //cancelar a atual
        await cancelarCorrida(orderatual, 'Demora em aceitar', 'EzTaxi')

        try {
            // setMotoristaLivre([])
            const museums = query(collection(db, 'motoristas'), 
            where("status", "==", 'Teste'), 
            where("id", "!=", idmotoristaatual),limit(1),
            where("tipoVeiculo", "==", dadocorridaatual.dadosCorrida.tipoVeiculo),limit(1),
            );
            // const querySnapshot = await getDocs(museums);
            onSnapshot(museums, querySnapshot => {
                // console.log('querySnapshot', querySnapshot.size)
                if(querySnapshot.size === 0){
                    setSemMotorista(false)
                }else {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, ' => ********** buscarMotoristaLivre', doc.data());
                        // selected, 
                        // valor, 
                        // distancia,
                        // destination,
                        // duration,
                        // yourLocation,
                        // region,
                        // primeiraCorrida,
                        // valorSemBonus

                //         idMotorista: dadosCorrida.id,
                // idCliente: user.id,
                // dadosCorrida: dadosCorrida,
                // yourLocation: yourLocation,
                // yourGeoLocation: regionGeo,
                // valor: valor,
                // distancia: distancia,
                // destination: destination,
                // duration: duration,
                // user: user,
                // aceite: null,
                // buscouPassageiro: false,
                // buscandoPassageiro: null, // nullo sem intera????o, true buscando passageiro, false: saiu da rota de buscar passageiro
                // status: 'PENDENTE',
                // data: Timestamp.fromDate(new Date()),
                // corridaBonus,
                // valorSemBonus
                        salvarOrder(
                            doc.data(), 
                            dadocorridaatual.valor,
                            dadocorridaatual.distancia, 
                            dadocorridaatual.destination, 
                            dadocorridaatual.duration, 
                            useratual, 
                            dadocorridaatual.yourLocation, 
                            dadocorridaatual.yourGeoLocation, //region, 
                            dadocorridaatual.corridaBonus, 
                            dadocorridaatual.valorSemBonus
                        )

                        // dadosMotoristas.push(doc.data())
                    });
                    setShowCountdown(true)
                    // setMotoristaLivre(dadosMotoristas)
                    // for (let m = 0; m < dadosMotoristas.length; m++) {
                    //     const element = dadosMotoristas[m];
                    //     console.log('dadosMotoristas **** for', element)
                    //     // console.log('dadosMotoristas **** for 2', element.veiculos.length)
                        
                    // }
                }
            });
    
        } catch (error) {
            console.log('Erro ao buscar motoristas livres ', error)
        }
    }

    const handleBack = () => {
        setDestination(null)
        // handleMenuTop()
        // setTelaConfirmacao(!telaConfirmacao)
    }

    const refazerPedido = (e) => {

    }

    const handleLocationPoiClick = (e) => {
        const {coordinate: { latitude: latitude, longitude: longitude }, name} = e.nativeEvent;
        console.log('handleLocationPoiClick', latitude, longitude, name, mudarLocalizacao)
        if(mudarLocalizacao){ // se mudar localizacao for verdadeiro
            // atualizaLocalizacaoAtual(e.nativeEvent)
            console.log('======>', latitude, longitude, name)
            // setLocation(props)
            setYourLocation(name)
            setMudarLocalizacao(!mudarLocalizacao)
            setRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0143,
                longitudeDelta: 0.0134,
            })

        }else{ // se mudar localizacao for falso
            // handleMenuTop()
            // handleBack()
            
            setDestination({
                latitude,
                longitude,
                title: name,
                title_secondary: name,
            })
        }
    }

    const handleLocationMudadoSelected = (data, { geometry }) => {
        // alert(`aqui`)
        console.log('onLocationMudadoSelected', data, geometry)
        const {location: { lat: latitude, lng: longitude }} = geometry;
        setYourLocation(data.structured_formatting.main_text)
        setMudarLocalizacao(!mudarLocalizacao)
        setRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
        })
        // handleMenuTop()
        // atualizaLocalizacaoAtual({location:{ lat: latitude, lng: longitude }, name: data.structured_formatting.main_text})
        // setDestination({
        //     latitude,
        //     longitude,
        //     title: data.structured_formatting.main_text,
        //     title_secondary: data.structured_formatting.secondary_text,
        // })
    }

    const handleLocationSelected = (data, { geometry }) => {
        //console.log('handleLocationSelected', data, geometry)
        const {location: { lat: latitude, lng: longitude }} = geometry;
        // handleMenuTop()
        setDestination({
            latitude,
            longitude,
            title: data.structured_formatting.main_text,
            title_secondary: data.structured_formatting.secondary_text,
        })
    }

    function atualizaLocalizacaoAtual(props){
        console.log(`Proppp`, props.coordinate)
        setLocation(props)
        setYourLocation(props.name)
        setMudarLocalizacao(!mudarLocalizacao)
    }

    function mudarLocalizacaoAtual(props){
        console.log(`mudarLocalizacao`, mudarLocalizacao)
        if(!mudarLocalizacao){
            console.log(`2`, )
            setMudarLocalizacao(!mudarLocalizacao)
            setYourLocation(false)
        }else{
            console.log(`1`, )
            carregarLocalizazao()
        }
    }

    async function verific(){
        const token = await AsyncStorage.getItem('@RNAuth:token')
        if(token){
            //console.log('token 1?? useEffect', token)
            userLogado(token)
        }else{
            console.log('N??o est?? logado')
            setUser(null)
            setCompletarPerfil(false)
            setLoading(false)
        }
    }

    async function carregarLocalizazao(){
        // setLoading(true)
        console.log('location =======================================', 1)
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('location =======================================', 2, status)
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          console.log('location =======================================', 3)

          try {
              
                let locationGeo = await Location.getCurrentPositionAsync({
                    //accuracy: Location.Accuracy.BestForNavigation,
                    //distanceInterval: 5
                });
                console.log('location =======================================', locationGeo)
                setLoading(false)
                console.log('location', locationGeo.coords)
                // setLocation(location);
                setRegion({
                    latitude: locationGeo.coords.latitude,
                    longitude: locationGeo.coords.longitude,
                    latitudeDelta: 0.0143,
                    longitudeDelta: 0.0134,
                })
            
                // buscar localidade atual
                const response = await Geocoder.from({
                  latitude : locationGeo.coords.latitude,
                  longitude : locationGeo.coords.longitude
                });
                const address = response.results[0].formatted_address;
                const addressComponents = response.results[0].address_components;
              //   console.log('address', address)
              //   console.log('response.results[0]', response.results[0])
              //    console.log('addressComponents', addressComponents)
              //   setYourLocation(addressComponents[1].short_name)
                setYourLocation(address)
                setMudarLocalizacao(false)
                var cidadeEstado = []
                //buscar informa????o de CIDADE e ESTADO
              //   console.log('addressComponents', addressComponents)
                let resCidadade = addressComponents.filter(addres => addres.types[0] === 'administrative_area_level_2')
                let resEstado = addressComponents.filter(addres => addres.types[0] === 'administrative_area_level_1')
                
                setCidadeEstado({
                  'cidade' : resCidadade[0].long_name,
                  'estado' : resEstado[0].long_name
                })
      
                console.log('if', cidadeEstado)
                setLocation(address.substring(0, address.indexOf(",")))
          } catch (error) {
            console.log(`Error locationGeo`, error)
            setLoading(false)
          }

          
    }


    async function schedulePushNotificationLocal(title, body) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: title,
            body: body,
            data: { data: 'goes here' },
          },
          trigger: { seconds: 2 },
        });
    }


    async function playSound() {
        console.log('Loading Sound');
        // const { sound } = await Audio.Sound.createAsync(
        //    require(aud)
        // );
        // setSound(sound);
    
        // console.log('Playing Sound');
        // await sound.playAsync(); 
    }

    async function fazerChamadaMotorista(numeroMotista) {
        try {
      
              // buscar configura????es da chamada
              let res
              try {
                  const q = query(collection(db, "config"), where("id", "==", 'call'));
                  const querySnapshot = await getDocs(q);
                  querySnapshot.forEach((doc) => {
                      res = doc.data()
                  });
              } catch (error) {
                  console.log('Erro ao buscar config de chamada ', error)
              }
      
              if(res?.status && res?.link && numeroMotista){
                  await fetch(`${res?.link}/call/${'+55'+numeroMotista}/${res?.from}`, { //call/:to/:from
                      method: 'POST',
                      headers: {
                      'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ 
                          to: '+55'+numeroMotista,
                          from: res?.from,
                          body: 'mensagem',
                      })
                  });
              }
        } catch (error) {
          console.log('Error enviar aviso para o motorista', error)
        //   alert('Error enviar aviso para o motorista ' + error.toString())
        }
    }


    // buscar hitorico de corridas
    async function historicoChats(dados){
        console.log('dados historicoChats ', dados)
        setLoadi(true)
        try {
            const q = query(collection(db, "chats"), where('idTransacao', '==', dados.id));
            const querySnapshot = await getDocs(q);
            var dadosChats = []
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, ' => historicoCorridas ', doc.data());
                console.log(' => historicoChats ', doc.data());
                dadosChats.push({id: doc.id, data: doc.data()})
         
            });
            setChats(dadosChats)
            setLoadi(false)
    
        } catch (error) {
            console.log('Erro ao buscar chats ', error)
            alert('Erro ao historico chat' + error.toString())
            setLoadi(false)
        }
       
    }

    // buscar hitorico de conversas no chat
    async function historicoCorridas(id){
        // console.log('idcliente ', id)
        // alert('Id do cliente: '+ id)
        setLoadi(true)
        try {
            const q = query(collection(db, "order"), where('idCliente', '==', id), orderBy("data", "desc"));
            const querySnapshot = await getDocs(q);
            var dadosHistorico = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => historicoCorridas ', doc.data());
                dadosHistorico.push({id: doc.id, data: doc.data()})
            });
            setHistorico(dadosHistorico.length === 0 ? null : dadosHistorico)
            setLoadi(false)
    
        } catch (error) {
            console.log('Erro ao buscar historico de corridas ', error)
            alert('Erro ao buscar historico de corridas ' + error.toString())
            setLoadi(false)
        }
    }


    // chat
    //https://blog.jscrambler.com/build-a-chat-app-with-firebase-and-react-native

    // async function monitorarChat(id){
    //     const q = query(collection(db, "chats"), where("sentBy", "==", id));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         // console.log('doc.data() monitorarChat', doc.data())
    //     });
    //     // console.log("unsubscribe ", unsubscribe);
    //     });
    // }
    
    async function addNewChat({_id, text, createdAt, user : usuario}) {
        console.log('Dados em addNewCha ', _id, text, createdAt, usuario, usuario.to)
        // alert("Enviando mensagem push para motorista"+ usuario.to.expoPushToken)
        try {
            const mymsg = {
                _id,
                text,
                user: {
                    _id: usuario._id,
                    name: usuario.name,
                    avatar: usuario.avatar,
                },
                sentBy:usuario._id,
                sentTo:usuario.to._id,
                idTransacao: usuario.idTransacao,
                createdAt
            }
            console.log('mymsg', mymsg)
            setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))

            await addDoc(collection(db, 'chats'), {
                // chatId: docid,
                status: true,
                ...mymsg
            });


            // envia notifica????o para o destinat??rio
            if(usuario?.to?.expoPushToken){
                // alert(usuario.to.expoPushToken)
                schedulePushNotification(usuario.to.expoPushToken, 'Mensagem do passageiro', text)
            }
        } catch (error) {
            console.log('Error addNewChat', error)
            alert('Error addNewChat ' + error.toString())
        }

    }
    
    const onSend = useCallback((messages = []) =>  {  
        const msg = messages[0];    
        console.log('messages ', msg)
        // console.log('dados da mensagem', messages[0])

        addNewChat(msg)

    }, []);

    /**
     * 
     * @param {Atualiza o status das mensagem para false (lidas)} idChat 
     */
    // 

    function desativarAlertaMsg(){
        setNovaMsg(false)
    }

    async function iniciarChat(idChat, idcliente){
        // alert('Monitorando mensagens ' + idChat + ' => ' + idcliente)
        setLoadi(true)
        
        const collectionRef = collection(db, 'chats');
        const q = query(collectionRef, where('idTransacao', '==', idChat), orderBy("createdAt", "desc"));
    
        onSnapshot(q, querySnapshot => {
            // console.log('NOva mensagem, ', querySnapshot.size)
            if(querySnapshot.size === 0) {
                // setNovaMsg(false)
            }
            if(querySnapshot.size != 0) {
                // querySnapshot.docs.map(doc => {
                //     console.log('>>>>>>> querySnapshot iniciarChat',  doc.data())
                // })
                // setNovaMsg(true)
                setMessages(
                    querySnapshot.docs.map(doc => ({
                        _id: doc.data()._id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user
                    })
                )
                );
                
            }
        });

        // const collectionRef2 = collection(db, 'chats');
        const q2 = query(collectionRef, where('idTransacao', '==', idChat),  where('sentTo', '==', idcliente), where('status', '==', true), orderBy("createdAt", "desc"));
        onSnapshot(q2, querySnapshot => {
            // AlertDialog('aqui??')
            // console.log('querySnapshot.size para verificar mensagem pendente', querySnapshot.size)
            if(querySnapshot.size === 0) {
                setNovaMsg(false)
            }else{
                querySnapshot.docs.map(doc => {
                    if(doc.data().status){
                        setNovaMsg(true)
                        // schedulePushNotificationLocal('Nova mensagem', 'Voc?? tem mensagens n??o lidas')
                    }
                    // console.log('>>>>>>> querySnapshot iniciarChat',  doc.data())
                })
            }
        })
        // try {

        //     const collectionRef = collection(db, 'chats');
        //     const q = query(collectionRef, where('idTransacao', '==', idChat), orderBy("createdAt", "desc"));
        
        //     onSnapshot(q, querySnapshot => {
        //         // console.log('querySnapshot', querySnapshot)
        //         setMessages(
        //             querySnapshot.docs.map(doc => {
        //                 // console.log('querySnapshot+++**', doc.data(), user)
        //                 // alert('==> Text', doc.data().text + ', User ' + doc.data().user)
        //                 if(doc.data().status === true && doc.data().sentTo == idcliente){
        //                     setNovaMsg(true)
        //                 }
        //                 return {
        //                     _id: doc.data()._id,
        //                     createdAt: doc.data().createdAt.toDate(),
        //                     text: doc.data().text,
        //                     user: doc.data().user
        //                 }
        //             }
        //         )
        //         );
        //     });
            
        // } catch (error) {
        //     alert("Erro ao carregar mensagens do chat " + error.toString())
        // }
        
     
    }

    // fim chat

    async function userLogado(token){
        //console.log('Platform.OS' ,Platform.OS)
        try {

            if(Platform.OS === 'ios'){
                const auth = getAuth();
                onAuthStateChanged(auth, use => {
                    console.log('usario logado trtrtrtr', use)
                    if (use != null) {
                        console.log('Est?? logado agora', use.uid);
                        
                        buscarDadosUser(use.uid)
                        //  monitorarChat(use.uid)
                        verificarOrderAberta(use.uid)
                        verificarOrder(use.id)
                    }else{
                        console.log('N??o est?? logado userLogado');
                        setLoading(false)
                    }
                })
            }else{
                // console.log('token passado na fun????o userLogado ', token)
                const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`);
                const userInfo = await response.json();
                // var texto = JSON.stringify(userInfo);
                //console.log('dados do usuario logado', userInfo);
                // alert('userLogado dados do usuario ' + texto)
                setUser(userInfo)
                if(userInfo.error?.status === 'UNAUTHENTICATED'){
                    logout()
                }else{
                    buscarDadosUser(userInfo.id)
                    // monitorarChat(userInfo.id)
                    verificarOrderAberta(userInfo.id)
                    verificarOrder(userInfo.id)
                }
                setLoading(false)
                // const value = await AsyncStorage.getItem('@RNAuth:user')
                // console.log('AsyncStorage.setItem', JSON.parse(value))
                // setUser(JSON.parse(value))
            }

            

        } catch (error) {
            console.log('erro fun????o userLogado', error)
            alert('Error userLogado ' + error.toString())
            setLoading(false)
        }
    }

    async function removerOrder(id){
        await deleteDoc(doc(db, "order", id));
        navigation.navigate('Dashboard');
        
    }
    async function atualizarStatusMotorista(id, sts){
        // status: Livre, Ocupado, Indispon??vel
        console.log('atualizarStatusMotorista', id, sts)
        // setLoading(true)
        try {''
            const motoristaRef = doc(db, "motoristas", id);
            await updateDoc(motoristaRef, {
                status: sts
            }); 
            setStatusMotorista(sts)
            // setLoading(false)
        } catch (error) {
            alert('N??o foi possivel atualizar seu status')
            setLoading(false)
        }
    }

    // cancela a corrida e define um motivo do cancelamento
    async function cancelarCorrida(dados, motivo, quemcancelou){

        setLoading(true)
        // console.log('PPPPPP ', dados)
        // alert(motivo)
        // console.log('cancelarCorridacancelarCorridacancelarCorrida', dados.id, motivo)
        if(dados){
            // console.log('cancelarCorrida', dados[0].id, motivo)
            try {
                const userRef = doc(db, "order", dados.id);
                await updateDoc(userRef, {
                    'status': 'CANCELADO',
                    'dataCancelamento': Timestamp.fromDate(new Date()),
                    'motivoCancelamento': motivo,
                    'quemCancelou': quemcancelou 
                });
                // atualizarStatusMotorista(dados.data.idMotorista, 'Livre')
                setOrderStatus({'status': 'CANCELADO', 'quemCancelou': 'Cliente', 'dados': dados[0]})
                setNovaOrder(null)
                setLoading(false)
            } catch (error) {
                console.log('Erro ao cancelar corrida', error, error.response)
                alert('Erro ao cancelar corrida ' + error.toString())
                setLoading(false)
                // alert('Erro ao tentar cancelar, fale com o suporte')
            }
        }
    }


    /**
     * 
     * @param {*} seg segundos para o delay
     * @param {*} dadosCorrida dadosCorrida s??o os dados do motorista
     */
    // async function delay(seg, dadosCorrida, aceite){
    //     console.log('Redirecionando aqui', seg, dadosCorrida)
    //     await new Promise(resolve => setTimeout(resolve, 3000));
    //     // console.log('Redireciounou agora aqui')
    //     if(aceite === 'sim'){
    //         navigation.navigate('Chat',{
    //             idMotorista: dadosCorrida.id,
    //             nomeMotorista: dadosCorrida.nome,
    //             pictureMotorista: dadosCorrida.picture
    //         });
    //     }else if(aceite === 'nao'){
    //         // Alert.alert('Desculpe: ', 'O motorista recusou sua corrida, pe??o que fa??a uma nova busca e selecione outro motorista')
    //     }
    // }

    async function verificarOrderAberta(id){
        //verifica ordem aberta do cliente
        const collectionRef = collection(db, 'order');
        const q = query(
            collectionRef, 
            where('idCliente', '==', id), 
            // where('aceite', '==', true), 
            // where('status', '==', 'Aberto'),
            orderBy("data", "desc"),
            limit(1)
        );
        onSnapshot(q, querySnapshot => {
        //  console.log('querySnapshot verificarOrderAberta', querySnapshot, querySnapshot.size)
            if(querySnapshot.size === 0){
                setNovaOrder(null)
            }else{
                
                querySnapshot.docs.map(doc => {
                    // console.log('id verificarOrderAberta', doc.id)
                    // console.log('querySnapshot verificarOrderAberta ', doc.id, doc.data(), doc.data().status)
                    var dd = {'id': doc.id, 'data': doc.data()}
                    if(doc.data().status === 'PENDENTE'){
                        setNovaOrder(dd)
                    }else if(doc.data().status === 'RECUSADO'){
                        // setNovaOrder(null)
                        // setOrderStatus({'status': 'Cancelado', 'quemCancelou': 'Motorista', 'dados': dd})
                        // setNovaOrder(null)
                        // setNovaOrder()
                        setNovaOrder(dd)
                    }else if(doc.data().status === 'ACEITOU'){
                        // setNovaOrder(null)
                        setNovaOrder(dd)
                        iniciarChat(doc.id, doc.data().idCliente)
                        buscarLocalizacaoMotorista(doc.data().idMotorista)
                    }else if(doc.data().status === 'BUSCANDOPASSAGEIRO'){
                        setNovaOrder(dd)
                        iniciarChat(doc.id, doc.data().idCliente)
                        buscarLocalizacaoMotorista(doc.data().idMotorista)
                        if(doc.data().avisoQueChegou){
                            Vibration.vibrate(10 * 1000)
                            Alert.alert(
                                "O Motorista chegou",
                                "O motorista j?? est?? no ponto esperando.",
                                [
                                    {
                                      text: "Ok",
                                      onPress: () => Vibration.cancel(),
                                      style: "cancel"
                                    },
                                    // { text: "Estou indo", onPress: () => {
                                    //   alert('aqui')
                                    // }}
                                ]
                            );

                            schedulePushNotificationLocal('O Motorista j?? chegou', 'O Motorista est?? chamando por voc??')
                          
                        }
                    }else if(doc.data().status === 'PEGOUPASSAGEIRO'){
                        setNovaOrder(dd)
                        iniciarChat(doc.id, doc.data().idCliente)
                        buscarLocalizacaoMotorista(doc.data().idMotorista)
                    }else if(doc.data().status === 'FINALIZADO'){
                        setNovaOrder(null)
                    }else if(doc.data().status === 'CANCELADO'){
                        setNovaOrder(null)
                    }
                    // if(doc.data() && doc.data().aceite === true){
                    //     console.log('Motorista aceitou 2')
                    //     setAceite('sim')
                    //     // delay(3000, dadosCorrida, 'sim')
                        
                    // }else if(doc.data() && doc.data().aceite === false){
                    //     console.log('Motorista recusou 2')
                    //     setAceite('nao')
                    //     setNovaOrder(null)
                    //     // setOrderStatus({'status': 'Cancelado', 'quemCancelou': 'Motorista'})
                    //     var dd = {'id': doc.id, 'data': doc.data()}
                    //     setOrderStatus({'status': 'Cancelado', 'quemCancelou': 'Motorista', 'dados': dd})
                    //     // delay(7000, dadosCorrida, 'nao')
                    // }else if(doc.data() && doc.data().aceite === null){
                    //     console.log('Motorista ainda nao  2')
                    //     setAceite('aguardando')
                    //     // delay(7000, dadosCorrida, 'nao')
                    // }
                   
                    // return {'id': doc.id, 'data': doc.data()} 
                })
                
            }
        });
    }
    async function verificarOrder(id){
        onSnapshot(doc(db, "order", id), (doc) => {
            
            if(doc.data() && doc.data().aceite === true){
                // console.log('Motorista aceitou 1')
                setAceite('sim')
                // delay(3000, dadosCorrida, 'sim')
                
            }else if(doc.data() && doc.data().aceite === false){
                // console.log('Motorista recusou 1')
                setAceite('nao')
                setNovaOrder(null)
                // delay(7000, dadosCorrida, 'nao')
            }else if(doc.data() && doc.data().aceite === null){
                // console.log('Motorista ainda nao aceitou 1')
                setAceite('aguardando')
                // delay(7000, dadosCorrida, 'nao')
            }
            // console.log( " data: ", doc.data(), doc.data().aceite);
        });
    }

    const editarUltimaMensagem = async (idusuario) => {
        setLoading(true)
        try {
            // imagemPerfil ? uploadImage(imagemPerfil, imageMeta) : '';
            // buscar a ultima mensagem 
            const collectionRef2 = collection(db, 'chats');
            const q2 = query(collectionRef2, where('sentTo', '==', idusuario), where('status', '==', true));
            onSnapshot(q2, querySnapshot => {
                // AlertDialog('aqui??')
                // console.log('querySnapshot.size para verificar mensagem pendente', querySnapshot.size)
                if(querySnapshot.size != 0) {
                    querySnapshot.docs.map(doc => {
                        console.log('>>>>>>> querySnapshot editarUltimaMensagem', doc.id)
                        editarUltima(doc.id)
                    })
                }else{
                }
            })

            async function editarUltima(id){
                console.log('Aditar msg', id)
                const userRef = doc(db, "chats", id);
                await updateDoc(userRef, {
                    status: false
                });
            }
            
            // // console.log('Usu??rio editado com sucesso')
            setLoading(false)
        } catch (error) {
            console.log('Erro ao buscar ultima mensagem para editar', error)
            setLoading(false)
        }
    }

    async function salvarOrder(
        dadosCorrida, 
        valor, 
        distancia, 
        destination, 
        duration, 
        user,
        yourLocation,
        regionGeo,
        corridaBonus,
        valorSemBonus
    ){

        console.log('Salvando ordem para o motorista', dadosCorrida, 
        valor, 
        distancia, 
        destination, 
        duration, 
        user,
        yourLocation,
        regionGeo,
        corridaBonus,
        valorSemBonus)
        setAceite('aguardando')
        
        try {
            const docRef = await addDoc(collection(db, "order"), {
                idMotorista: dadosCorrida.id,
                idCliente: user.id,
                dadosCorrida: dadosCorrida,
                yourLocation: yourLocation,
                yourGeoLocation: regionGeo,
                valor: valor,
                distancia: distancia,
                destination: destination,
                duration: duration,
                user: user,
                aceite: null,
                buscouPassageiro: false,
                buscandoPassageiro: null, // nullo sem intera????o, true buscando passageiro, false: saiu da rota de buscar passageiro
                status: 'PENDENTE',
                data: Timestamp.fromDate(new Date()),
                corridaBonus,
                valorSemBonus
                // dataCancelamento: '',
                // motivoCancelamento: motivo,
                // quemCancelou: Cliente  
            });
            setIdTransacao(docRef.id)
            verificarOrderAberta(user.id)
            // verificarOrder(docRef.id)

            // atualizar status do motirista 
            // const motoristaRef = doc(db, "motoristas", dadosCorrida.id);
            // await updateDoc(motoristaRef, {
            //     status: 'Ocupado'
            // });   


            // setInfoCorrida(dadosCorrida)
            // console.log("Document written with ID: ", docRef.id);
            // enviar notifica????o para o motorista
            schedulePushNotification(dadosCorrida.tokenPush, 'Passageiro chamando ...', 'Abra o app e aceite sua corrida!')
            
            // Fazer chamda para o motorista
            fazerChamadaMotorista(dadosCorrida?.telefone)

        } catch (error) {
            console.log('Erro ao salvar ordem', error, error.response)    
        }
    }

    async function buscarLocalizacaoMotorista(id){
        // alert('id motorista'+ id)
        try {
            const museums = query(collection(db, 'motoristas'), where("id", "==", id));
            // const querySnapshot = await getDocs(museums);
            onSnapshot(museums, querySnapshot => {
                querySnapshot.forEach((doc) => {
                    // alert('Id querySnapshot' + doc.id)
                    // console.log(doc.id, ' => ********** buscarLocalizacaoMotorista', doc.data());
                    // console.log(' => ********** buscarLocalizacaoMotorista location', doc.data().location);
                    setLocalizacaoMotorista(doc.data().location)
                });

            });
        } catch (error) {
            console.log('Erro ao buscar localiza????o ', error)
        }
    }
    async function buscarMotoristaLivre(){
        // console.log('buscarMotoristaLivre')
        try {
            setMotoristaLivre([])
            const museums = query(collection(db, 'motoristas'), where("status", "==", 'Teste'));
            // const querySnapshot = await getDocs(museums);
            onSnapshot(museums, querySnapshot => {
                var dadosMotoristas = []
                // console.log('querySnapshot', querySnapshot.size)
                if(querySnapshot.size === 0){
                    setSemMotorista(false)
                }else {
                    querySnapshot.forEach((doc) => {
                        //console.log(doc.id, ' => ********** buscarMotoristaLivre', doc.data());
                        dadosMotoristas.push(doc.data())
                    });
                    setMotoristaLivre(dadosMotoristas)
                    // for (let m = 0; m < dadosMotoristas.length; m++) {
                    //     const element = dadosMotoristas[m];
                    //     console.log('dadosMotoristas **** for', element)
                    //     // console.log('dadosMotoristas **** for 2', element.veiculos.length)
                        
                    // }
                }
            });
    
        } catch (error) {
            console.log('Erro ao buscar motoristas livres ', error)
        }
    }

    const uploadImage2 = async (file, userid) => {
        setImagePerfil({'progress': 10, 'file': file})
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', file, true);
          xhr.send(null);
        })
        console.log('fileMeta', file, blob._data.name)
        const storage = getStorage();

        // Create the file metadata
        /** @type {any} */
        const metadata = {
        contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, userid ? 'perfil/' + userid+'.jpg' : 'perfil/' + blob._data.name);
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done', snapshot);
            setImagePerfil({'progress': progress, 'file': file})
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            console.log('Erro upload ', error)
            setImagePerfil({'progress': 0, 'file': file})
            switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;

            // ...

            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
        }, 
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                setImagePerfil({'progress': 0, 'file': downloadURL})
                // const toast = useToast();
                // toast.show({
                //     description: "Sucesso!"
                // })
                //atualiza no banco de dados
                atualizarFotoPerfil(downloadURL)
            });
        }
        );

        const atualizarFotoPerfil = async (linkPerfil) => {
            setLoading(true)
            try {
                // imagemPerfil ? uploadImage(imagemPerfil, imageMeta) : '';
                const userRef = doc(db, "users", userid);
                await updateDoc(userRef, {
                    picture: linkPerfil
                });
                // console.log('Usu??rio editado com sucesso')
                setLoading(false)
            } catch (error) {
                console.log('Erro ao foto do perfil perfil', error)
                setLoading(false)
            }
        }
    }

    async function updateUser(id, data, token=expoPushToken){
        setLoadi(true)
        setLoading(true)
        // // console.log('submiting with ', data);
         console.log('===> dados user passado da fun????o updateUser', id, data, token)
        try {
            // imagemPerfil ? uploadImage(imagemPerfil, imageMeta) : '';
            const userRef = doc(db, "users", id);
            await updateDoc(userRef, {
                name: data.nome,
                contato: data.contato,
                tokenPush: token
            });
            console.log('Usu??rio editado com sucesso')
            verific()
            setLoadi(false)
            setLoading(false)
            if(data.nome){
                setCompletarPerfil(false)
            }
        } catch (error) {
            console.log('Erro ao atualizar perfil', error)
            setLoadi(false)
            setLoading(false)
        }
    }

    async function buscarDadosUser(id, conf = config){

        // buscar configura????es de bonus
        let res
        try {
            const q = query(collection(db, "config"), where("id", "==", 'bonus'));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setConfig(doc.data())
                res = doc.data()
                //console.log('res config', res)
            });
        } catch (error) {
            console.log('Erro ao buscar config ', error)
        }
        try {
            const q = query(collection(db, "users"), where("id", "==", id));
            const querySnapshot = await getDocs(q);
            // console.log('querySnapshot', querySnapshot, querySnapshot.size)
            querySnapshot.forEach((doc) => {
                //console.log("buscarDadosUser =>", doc.id, " => ", doc.data());
                //updateUser(doc.id, {'nome': doc.data().name, 'contato': doc.data().contato })
                setLoading(false)
                setUser(doc.data())
                addAsync(doc.data())
                setImagePerfil({'progress': 0, 'file': doc.data().picture})
                if(res?.statusBonus){
                    setPrimeiraCorrida(doc.data().primaira_corrida)
                    if(doc.data().primaira_corrida){
                        Alert.alert('Parab??ns!', 'Voc?? ganhou at?? R$20,00 para usar na sua 1?? corrida')
                    }
                }

                if(!doc.data().name || !doc.data().contato){
                    setCompletarPerfil(true)
                }else{
                    setUser(doc.data())
                }
            });

        } catch (error) {
            console.log('Erro ao buscar dados do usu??rio', error)
            alert('Erro ao buscar dados do usu??rio: ' + error.toString())
            setUser(null)
            setCompletarPerfil(false)
            setNovaOrder(null)
            setLoading(false)
        }
    }

    async function addAsync(res, token=expoPushToken){
        // console.log('resssssss', res, token)
        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(
            {
                'email': res.email,
                'family_name': res.family_name,
                'given_name': res.given_name,
                'locale': res.locale,
                'name': res.name,
                'picture': res.picture,
                'verified_email': res.verified_email,
                'cidade': cidadeEstado ? cidadeEstado.cidade : '',
                'estado': cidadeEstado ? cidadeEstado.estado : '',
                'tokenPush': token,
                'contato' : res.contato
                // 'tipoUsuario': usuarioDefinido
            }
        ))

        console.log('Passou no addAsync')
        carregarLocalizazao()
        
        // const value = await AsyncStorage.getItem('@RNAuth:user')
        // console.log('AsyncStorage.setItem', JSON.parse(value))
        // return res
    }

    async function saveProfile(info, token=expoPushToken, provedor){
        console.log('Salvando dados do usuario aqui', token)
        // console.log('Info', info, info.id)
        try {
            const q = query(collection(db, "users"), where("id", "==", info.id));
            const querySnapshot = await getDocs(q);
            // console.log('userRef', querySnapshot.size)
            // if(querySnapshot.size != 0){
            const userRef = doc(db, "users", info.id);
               
                if(provedor === 'google'){
                    if(querySnapshot.size === 0){ 

                        await setDoc(userRef, { 
                            email: info.email,
                            family_name: info.family_name,
                            given_name: info.given_name,
                            locale: info.locale,
                            name: info.name,
                            picture: info.picture,
                            verified_email: info.verified_email,
                            cidade: cidadeEstado ? cidadeEstado.cidade : '',
                            estado: cidadeEstado ? cidadeEstado.estado : '',
                            id: info.id,
                            tokenPush: token,
                            primaira_corrida: true, // se n??o tiver cadastro, se acrescenta 
                            provedor,
                            //contato: ''
                            // tipoUsuario: usuarioDefinido
                            }, { merge: true });

                    }else{

                        await setDoc(userRef, { 
                            email: info.email,
                            family_name: info.family_name,
                            given_name: info.given_name,
                            locale: info.locale,
                            name: info.name,
                            picture: info.picture,
                            verified_email: info.verified_email,
                            cidade: cidadeEstado ? cidadeEstado.cidade : '',
                            estado: cidadeEstado ? cidadeEstado.estado : '',
                            id: info.id,
                            tokenPush: token,
                            provedor,
                            //contato: ''
                            // tipoUsuario: usuarioDefinido
                            }, { merge: true });

                    }
                }

                //verifica se ?? apple e adiciona informa????es doperfil
                if(provedor === 'apple'){
                    if(querySnapshot.size === 0){ // verifica sej j?? exista uma conta
                        await setDoc(userRef, { 
                            email: info.email,
                            family_name: info.family_name,
                            given_name: info.given_name,
                            locale: info.locale,
                            name: info.name,
                            picture: info.picture,
                            verified_email: info.verified_email,
                            cidade: cidadeEstado ? cidadeEstado.cidade : '',
                            estado: cidadeEstado ? cidadeEstado.estado : '',
                            id: info.id,
                            tokenPush: token,
                            primaira_corrida: true, 
                            provedor
                            // tipoUsuario: usuarioDefinido
                            }, { merge: true });
                    }
                    // querySnapshot.forEach((doc) => {
                    //     console.log("buscarDadosUser apple =>", doc.id, " => ", doc.data());
                    //     if(!doc.data().name || !doc.data().contato){
                    //         setCompletarPerfil(true)
                    //     }else{
                    //         setUser(doc.data())
                    //     }
                    // });
                }

                setLoading(false)

                // await setDoc(doc(db, "users", info.id), {
                //     email: info.email,
                //     family_name: info.family_name,
                //     given_name: info.given_name,
                //     locale: info.locale,
                //     name: info.name,
                //     picture: info.picture,
                //     verified_email: info.verified_email,
                //     cidade: cidadeEstado ? cidadeEstado.cidade : '',
                //     estado: cidadeEstado ? cidadeEstado.estado : '',
                //     id: info.id,
                //     tokenPush: token
                //     // tipoUsuario: usuarioDefinido
                // }, 
                // {marge:true}
                // );
            // }
            addAsync(info)
            buscarDadosUser(info.id)
            verificarOrderAberta(info.id)
        
        } catch (error) {
            console.log('Erro ao salvar usuario', error, error.response)    
            setLoading(false)
        }
    }

    
    async function loadProfile(token, provedor){
        if(provedor === 'google'){
            try {
                // console.log('token na fun????o loadProfile', token)
                const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`);
                const userInfo = await response.json();
                var texto = JSON.stringify(userInfo);
                console.log('dados do usuario', texto, userInfo);
                await AsyncStorage.setItem('@RNAuth:token', token)
                // alert('dados do usuario loadProfile' + texto)
                // addAsync(userInfo)
                saveProfile(userInfo, expoPushToken, provedor)
                setUser(userInfo)
                // buscarDadosUser(userInfo.id)
                setLoading(false)
            } catch (error) {
                console.log('Erro loadProfile ', error, error.toString())
                // alert('dados do usuario error' + error.toString())
                setLoading(false)
            }
        }else if(provedor === 'apple'){
            const auth = getAuth();
            await AsyncStorage.setItem('@RNAuth:token', token)
            onAuthStateChanged(auth, (user) => {
                if (user) {
                  // User is signed in, see docs for a list of available properties
                  // https://firebase.google.com/docs/reference/js/firebase.User
                  const uid = user.uid;
                  // ...
                //   console.log('usuario conectado ', user)
                  saveProfile({
                    email: user.email,
                    family_name: '',
                    given_name: '',
                    locale: '',
                    name: user.displayName ? user.displayName : null,
                    picture: user.photoURL ? user.photoURL : null,
                    verified_email: user.emailVerified,
                    id: uid
                  }, expoPushToken, provedor)
                  
                } else {
                  // User is signed out
                  // ...
                  setLoading(false)
                }
            });
        }
    }
    
    async function loginGoogle(){
        try {
            // promptAsync()
            console.log('Logando ....')
            const CLIENT_ID = '741352224001-9b8pjmsf756mtitpjdfes7092310ar0j.apps.googleusercontent.com';
            // const CLIENT_ID = '1054676875897-p7mp2adga61ph9nk9kromupplhbhofls.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@nerialdo/eztaxi';
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`
            setLoading(true)
            const {type, params} =  await AuthSession.startAsync({authUrl})
    
            // console.log('response signInSocial', type, params)
            // alert('type' + type.toString())
            if(type === 'error'){
                console.log('N??o permitido')
                setLoading(false)
            }
           
            if(type === 'cancel'){
                console.log('Cancelado pelo usu??rio')
                setLoading(false)
            }
    
            if(type === 'success'){
                loadProfile(params.access_token, 'google')
            }
            
        } catch (error) {
            console.log('error', error.toString())
            alert('Erro no login' + error.toString())
        }
    }
    async function loginApple(){
        //https://medium.com/nerd-for-tech/apple-google-authentication-in-expo-apps-using-firebase-997125440032
        setLoading(true)
        const nonce = Math.random().toString(36).substring(2, 10);
    
        Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
            .then((hashedNonce) =>
                AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL
                    ],
                    nonce: hashedNonce
                })
            )
            .then((appleCredential) => {
                const { identityToken } = appleCredential;
                const provider = new OAuthProvider('apple.com');
                const credential = provider.credential({
                    idToken: identityToken,
                    rawNonce: nonce
                });
                const auth = getAuth();

                signInWithCredential(auth, credential).then((result) => {
                    // console.log('result result ', result)
                    // console.log('result result ', result.user)
                    const resultUser = result.user
                    setUser(resultUser)
                    // console.log('result result ', resultUser,  resultUser.accessToken)
                    loadProfile(resultUser.accessToken, 'apple')
                }, function (error) {
                    console.warn("Sign apple In Error", error);
                    setLoading(false)
                });
            })
            .catch((error) => {
                console.log('Error login apple', error)
                alert('Erro ao fazer login')
                setLoading(false)
            });

    }

    async function signInSocial(tipo){
        //https://extaxi-50c37.firebaseapp.com/__/auth/handler
        // console.log('Inicio', provider)
        if(tipo === 'google'){
            loginGoogle()
        }else if(tipo === 'apple'){
            loginApple()
        }
        
        // // signOut2()
       

        // // setLoading(true);
        // // promptAsync();
    }
    
    async function signIn({email, password}) {
        // console.log("user", user)
        // // setLoading(true)
        // await signInWithEmailAndPassword(auth, email.trim(), password)
        // .then((userCredential) => {
        //     const userLogado = userCredential.user;
        //     console.log("signInWithEmailAndPassword ", userLogado)
        //     api.defaults.headers['Autorization'] = `Bearer ${userLogado.accessToken}`;
            

        //     // async function addAsync(){
        //     //     await AsyncStorage.setItem('@RNAuth:token', userLogado.accessToken)
        //     //     // await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(
        //     //     //     {
        //     //     //         'name': '',
        //     //     //         'avatar': '#',
        //     //     //         'role': ''
        //     //     //     }
        //     //     // ))
        //     //     setUser(userLogado)
        //     // }
        //     // addAsync()

        //     // // setLoading(false)
        // })
        // .catch((error) => {
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     console.log("Erro ao logar usu??rio", errorCode, errorMessage)
        //     if(errorCode === 'auth/user-not-found'){
        //         alert('Nenhuma usu??rio foi encontrado')
        //     }else{
        //         alert('Erro ao tentar fazer o login')
        //     }
        //     // setLoading(false)
        // });

        // // api.defaults.headers['Authorization'] = `Bearer ${response.token}`

        // // await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user))
        // // await AsyncStorage.setItem('@RNAuth:token', response.token)
    }

    async function signOut2() {
        try {
            // signOut(auth).then(() => {
            //     // Sign-out successful.
                
            //     // AsyncStorage.clear().then(() => {
            //     //     console.log('Saiu do sistema')
            //     //     setUser(null)
            //     // });
            // }).catch((error) => {
            // // An error happened.
            //     console.log('Erro ao sair do sistema', error)
            // });
            AsyncStorage.clear().then(() => {
                console.log('Saiu do sistema')
                setUser(null)
                setCompletarPerfil(false)

                // signOut(auth).then(() => {
                //     // Sign-out successful.
                    
                //     // AsyncStorage.clear().then(() => {
                //     //     console.log('Saiu do sistema')
                //     //     setUser(null)
                //     // });
                // }).catch((error) => {
                // // An error happened.
                //     console.log('Erro ao sair do sistema', error)
                // });
            });
        } catch (error) {
            console.log('Erro ao sair do sistema trycatch', error)
        }
    }

    async function logout(){
        setLoading(true)
        setUser(null)
        setNovaOrder(null)
        setCompletarPerfil(false)
        AsyncStorage.clear().then(() => {
            console.log('Saiu do APP')
        })
        setLoading(false)
    }

    const limparOrder = () => {
        setNovaOrder(null)
    }
    const limparOrderStatus = () => {
        setOrderStatus(null)
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user, 
            user, 
            completarPerfil,
            signIn, 
            signInSocial,
            signOut2, 
            buscarDadosUser, 
            loading,
            loadi,
            logout,
            region,
            location,
            yourLocation,
            buscarMotoristaLivre,
            motoristaLivre,
            salvarOrder,
            idTransacao,
            removerOrder,
            aceite,
            iniciarChat,
            onSend,
            messages,
            // infoCorrida,
            updateUser,
            historicoCorridas,
            historico,
            historicoChats,
            chats,
            novaOrder,
            cancelarCorrida,
            expoPushToken,
            // showOrder,
            limparOrder,
            orderStatus,
            limparOrderStatus,
            semMotorista,
            novaMsg,
            desativarAlertaMsg,
            localizacaoMotorista,
            uploadImage2,
            imagePerfil,
            primeiraCorrida,
            editarUltimaMensagem,
            mudarLocalizacaoAtual,
            mudarLocalizacao,
            carregarLocalizazao,
            atualizaLocalizacaoAtual,
            handleLocationSelected,
            handleLocationMudadoSelected,
            destination,
            handleLocationPoiClick,
            handleBack,
            setSelected,
            setValor,
            setValorSemBonus,
            setValorBonus,
            selected,
            valor,
            valorSemBonus,
            valorBonus,
            showCountdown,
            chamandoNovoMotorista
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)
    return context
};

async function schedulePushNotification(token, title, body) {
    // alert("Token push do motorista, enviando mensagem push "+token)
    //   alert('tete')
    // await Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "You've got mail! ????",
    //     body: 'Here is the notification body',
    //     data: { data: 'goes here' },
    //   },
    //   trigger: { seconds: 2 },
    // });
    try {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            //   to: "ExponentPushToken[HoRWXVB76JN2coSrVbZp96]",
            to: token,
            title: title,
            body: body,
            })
        });
    } catch (error) {
        console.log('Error enviar aviso para o motorista', error)
        // alert('Error enviar aviso para o motorista ' + error.toString())
    }
}



async function registerForPushNotificationsAsync() {(0)
  let token = '';
//   if (Constants.isDevice) {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Falha ao obter token push para notifica????o!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        //console.log("Token notificarion", token);
    } catch (error) {
        console.log('Falha ao obter token push para notifica????o push! ', error. error.messages)
        alert('Falha ao obter token push para notifica????o push! ' + error.toString())
    }
//   } else {0
//     // alert('Deve usar o dispositivo f??sico para notifica????es push');
//   }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    //   lightColor: '#FF231F7C',
      sound: '../../assets/notificacoes/sound1.wav',
    });
  }
//   console.log("Token notificarion fora", token);
  return token;
}