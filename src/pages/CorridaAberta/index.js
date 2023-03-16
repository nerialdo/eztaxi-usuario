import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Alert, View, TouchableOpacity} from 'react-native';
import {
  Box,
  FlatList,
  Heading,
  Avatar,
  HStack,
  VStack,
  Text,
  Spacer,
  Center,
  NativeBaseProvider,
} from "native-base"
import {useAuth} from '../../contexts/auth';
import { format, parseISO, formatISO } from 'date-fns'
import LottieView from 'lottie-react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { Chat } from '../../componets/Chat';
import MapMonitoramento from '../../componets/Map_monitoramento';
import AlertMsg from '../../componets/AlertMsg';
import FabMsg from '../../componets/FabMsg';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import CountDown from '@robxyy/react-native-countdown'



const CorridaAberta = ({ navigation }) => {

  const { 
    loading, novaOrder, user, logout, 
    cancelarCorrida, messages, onSend, iniciarChat, 
    idTransacao, limparOrder, novaMsg,
    showCountdown,
    chamandoNovoMotorista,
    statusCorrida,
    minutodeEspera
  } = useAuth()
  const [ corridaAberta, setCorridaAberta ] = useState([])
  const [ isCaht, setIsChat ] = useState(false)
  const [duration, setDuration] = useState(0);
  const [distancia, setDistancia] = useState(0);

  const [contador, setContador] = useState(null);

  // const [showCountdown, setShowCountdown] = useState(true);
  const [remainingCount, setRemainingCount] = useState(0);
  const [minuto, setMinuto] = useState(0);
  const [segundo, setSegundo] = useState(0);

  const cont = useRef();

  useEffect(() => {
    // console.log('novaOrder pagina CorridaAberta', novaOrder)
    setCorridaAberta(novaOrder)
    if(idTransacao){
      iniciarChat(idTransacao)
    }
    setContador(true)
  }, [novaOrder]);


  const fecharAbrirChat = () => {
    setIsChat(!isCaht)
  }

  const distanciaTempo = (v) => {
    setDuration(v.duracao)
    setDistancia(v.distancia)
  }

  const converterMinuto = (min) => {
    if(min === 0){
        return 1 +'min'
    }
    if(min <= 60){
        return min +'min'
    }else{
        return parseFloat(min / 60).toFixed(2) + 'hs'
    }
  }

  const converterKm = (km) => {
      if(Math.floor(km) === 0){
          var decPart = (km+"").split(".")[1]
          return decPart + 'm'
      }else{
          return Math.floor(km) + 'km'
      }
  }

  // const cancelarAgora = (novaorder) => {
  //   Alert.alert('Deseja cancelar e chamar outro motorista?', [
  //     {
  //       text: 'Sim, quero cancelar!',
  //       onPress: () => cancelarCorrida(novaorder, 'Não informado'),
  //     },
  //     {
  //       text: 'Não, Eu vou aguardar este responder!',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //   ])
  // }

  function convSeg(seg){
    var dateObj = new Date(seg * 1000);
    // var minutes = dateObj.getUTCMinutes();
    // var seconds = dateObj.getSeconds();
    var minutes = format(dateObj, 'mm');
    var seconds = format(dateObj, 'ss');
    console.log('Seg', minutes,  seconds)
    setMinuto(minutes)
    setSegundo(seconds)
  }

  function moedaBR(amount, decimalCount = 2, decimal = ",", thousands = "."){
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      //(e)
    }
  }

  return (
      <>
      {/* {novaMsg && (
          <AlertMsg style={{zIndex: 9999}} />
      )} */}
      {/* {novaMsg && (
          <View style={styles.InfoGeralTop}>
              <AlertMsg fecharAbrirChat={fecharAbrirChat} novaMsg={novaMsg} />
          </View>
      )} */}
      {novaOrder.data.status === 'PENDENTE' && (
        <View style={styles.container}>
           <Heading fontSize="xl" p="4" pb="3">
              Aguardando motorista aceitar
            </Heading>
            <Heading fontSize="md" p="1" pb="1" color={'gray.400'} fontWeight='normal'>
              {/* <LottieView
                source={require('../../../assets/buscando_veiculo.json')} 
                autoPlay loop 
                style={{
                  width: '100%'
                }}
              /> */}
              Esta tela será atualizada automaticamente
            </Heading>
            <Heading fontSize="md" p="5" pb="1" textAlign={'center'} color={'gray.900'} fontWeight='normal'>
              Não saia desta tela, nós estamos informando o motorista que você está chamando. 
              Se o motorista não responder em {minutodeEspera} minutos vemos chamar outro.
            </Heading>
            {/* <CountDown
              style={{
                marginTop: 20
              }}
              until={10}
              timeToShow={['M', 'S']}
              timeLabels={{m: 'Minutos', s: 'Segundos'}}
              onFinish={() =>{Alert.alert('Atenção', 'Cancele esta chamada e chame outro motorista.')}}
              onPress={() => {}}
              size={18}
            /> */}
            <View style={{marginTop:20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
              <LottieView
                source={require('../../../assets/waiting-car.json')} 
                autoPlay loop 
                style={{
                  width: '50%'
                }}
              />
              <View style={{margin: 15}}>
                {showCountdown && (
                  <CountDown
                      millisInFuture={minutodeEspera * 60000}
                      countDownInterval={1000}
                      onTick={value => {
                        // console.log(`Value onTick`, value)
                        setRemainingCount(value);
                        convSeg(value)
                      }}
                      onFinish={() => {
                        chamandoNovoMotorista(novaOrder, user, 'Demora em aceitar', 'EzTaxi')
                      }}>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      {/* <Text>{`${remainingCount}s`}</Text> */}
                      <Text
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingTop: 5,
                          paddingBottom: 5,
                          paddingLeft: 5,
                          paddingRight: 5,
                          fontSize: 21,
                          fontWeight: 'bold'
                        }}
                      >{ minuto }</Text>
                      <Text
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: 2,
                        paddingBottom: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        fontSize: 18
                      }}
                      >:</Text>
                      <Text
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: 5,
                        paddingBottom: 5,
                        paddingLeft: 5,
                        paddingRight: 5,
                        fontSize: 21,
                        fontWeight: 'bold'
                      }}
                      >{segundo}</Text>
                    </View>
                  </CountDown>
                )} 
              </View>
              <View style={{margin: 15, width:'100%'}}>
                <Box pl="4" pr="5" py="2" bg={`amber.100`} style={{width:'100%'}}>
                  <Text>Chamando...</Text>
                  <HStack alignItems="center" mt={1} space={3}>
                    <Avatar size="48px" source={{
                    uri: novaOrder.data.dadosCorrida.picture
                  }} />
                    <VStack>
                      <Text color="coolGray.800" _dark={{
                      color: 'warmGray.50'
                    }} bold>
                        {novaOrder.data.dadosCorrida.nome}
                      </Text>
                      <Text color="coolGray.600" _dark={{
                      color: 'warmGray.200'
                    }}>
                        {novaOrder.data.dadosCorrida.tipoVeiculo} / {novaOrder.data.dadosCorrida.veiculos[0]?.placa}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text fontSize="xs" color="coolGray.800" _dark={{
                    color: 'warmGray.50'
                  }} alignSelf="flex-start">
                      R$ {moedaBR(novaOrder.data.valor)}
                    </Text>
                  </HStack>
                </Box>
              </View>
              {statusCorrida === 'RECUSADO' && (
                <Text>Corrida recusada</Text>
              )}
              {statusCorrida === 'PENDENTE' && (
                <TouchableOpacity
                  onPress={() => {
                    // cancelarCorrida(novaOrder, 'Não informado')
                    Alert.alert('Você quer cancelar esta corrida?', 'Você só pode cancelar até 3 corridas no mês', [
                      {
                        text: 'Sim, quero cancelar!',
                        onPress: () => {
                          // cont.remove()
                          cancelarCorrida(novaOrder, 'Não informado', 'Cliente')
                        },
                      },
                      {
                        text: 'Não!',
                        onPress: () => console.log('Cancel Pressed', 'Cliente'),
                        style: 'cancel',
                      },
                    ]);
                  }}
                  style={{
                    // width:'100%',
                    //backgroundColor: '#22d3ee',
                    borderColor: '#22d3ee',
                    borderWidth: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems:'center',
                    padding: 10,
                    borderRadius: 10,
                    margin: 5

                  }}
                >
                  <Text style={{color: '#22d3ee'}}>Cancelar Corrida</Text>
                </TouchableOpacity>
              )}
          </View>
        </View>
      )}
      {/* {novaOrder.data.status === 'RECUSADO' && (
        <View style={styles.container}>
          <VStack width={'100%'} padding={2} borderRadius={10} space={4} alignItems="center" >
            <VStack space={4} alignItems="center">
              <Text mt="1" textAlign={'center'} fontWeight="bold" fontSize={16}>
                O motorista recusou a sua ultima corrida
              </Text>
            </VStack>
            <LottieView
              source={require('../../../assets/erro_aceite.json')} 
              autoPlay loop 
              style={{
                width: '50%'
              }}
            />
            <Text mt="1" textAlign={'center'} fontWeight="light" fontSize={11}>
                O motorista recusou sua corrida, faça uma nova busca e selecione outro motorista
            </Text>

          </VStack>
          <View style={{marginTop:20, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  limparOrder()
                }}
                style={{
                  // width:'100%',
                  //backgroundColor: '#22d3ee',
                  borderColor: '#22d3ee',
                  borderWidth: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems:'center',
                  padding: 10,
                  borderRadius: 10,
                  margin: 5

                }}
              >
                <Text style={{color: '#22d3ee'}}>Retornar</Text>
              </TouchableOpacity>
          </View>
        </View>
      )} */}
      {(!isCaht && novaOrder.data.status === 'ACEITOU' || novaOrder.data.status === 'BUSCANDOPASSAGEIRO' || novaOrder.data.status === 'PEGOUPASSAGEIRO') && (
        <View style={styles.container}>
          <View style={{
            marginTop:40, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'row',
            position: 'absolute',
            width: '100%',
            minHeight: 50,
            top: 0,
            paddingBottom: 30,
            zIndex: 9999
          }}>
          {novaOrder.data.status === 'ACEITOU' && (
            <Heading fontSize="md" p="4" pb="3">
                O Motorista aceitou, aguarde.
            </Heading>
          )}
          {novaOrder.data.status === 'BUSCANDOPASSAGEIRO' && (
            <Heading fontSize="md" p="4" pb="3">
                O Motorista já está a caminho, aguarde.
            </Heading>
          )}
          {novaOrder.data.status === 'PEGOUPASSAGEIRO' && (
            <Heading fontSize="md" p="4" pb="3">
                Você já está no veículo
            </Heading>
          )}
          </View>
          <MapMonitoramento distanciaTempo={distanciaTempo} />

          {/* <View style={{
            marginTop:300, 
            display: 'flex', 
            // justifyContent: 'center', 
            // alignItems: 'center', 
            flexDirection: 'row',
            position: 'absolute',
            width: '100%',
            bottom: '50%',
            left: 30,
            paddingBottom: 30,
            zIndex: 9999
          }}>
            <View>
              <Text>Distancia</Text>
              <Text>10</Text>
            </View>
          </View> */}
          <View style={{
            marginTop:20, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: 'column',
            position: 'absolute',
            backgroundColor: 'white',
            width: '100%',
            minHeight: 150,
            bottom: 0,
            paddingBottom: 30
          }}>
              {/* <TouchableOpacity
                onPress={() => {
                  cancelarCorrida(novaOrder, 'Não informado')
                }}
                style={{
                  // width:'100%',
                  //backgroundColor: '#22d3ee',
                  borderColor: 'red',
                  borderWidth: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems:'center',
                  padding: 10,
                  borderRadius: 10,
                  margin: 5,
                  width: '45%'
                }}
              >
                <Text style={{color: 'red'}}>Cancelar Corrida</Text>
              </TouchableOpacity> */}
              <View
                style={{
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column',
                    padding: 5
                  }}
                >
                  <Text>Distâncias</Text>
                  <Text style={{fontSize: 19, fontWeight: 'bold'}}>{distancia}M</Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column',
                    padding: 5
                  }}
                >
                  <Text>Chega em</Text>
                  <Text style={{fontSize: 19, fontWeight: 'bold'}}>{converterMinuto(duration)}</Text>
                </View>
              </View>
              {novaOrder.data.status === 'PEGOUPASSAGEIRO' && (
                <TouchableOpacity
                  onPress={() => Alert.alert('Em breve', 'Estamos desenvolvendo esta funcionalidade.')}
                  style={{
                    // width:'100%',
                    //backgroundColor: '#22d3ee',
                    borderColor: 'orange',
                    borderWidth: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems:'center',
                    padding: 10,
                    borderRadius: 10,
                    margin: 5,
                    width: '45%'
                  }}
                >
                  <Text style={{color: 'orange'}}>Compartilhar rota</Text>
                </TouchableOpacity>
              )}
              {novaOrder.data.status != 'PEGOUPASSAGEIRO' && (
                <TouchableOpacity
                  onPress={fecharAbrirChat}
                  style={{
                    // width:'100%',
                    //backgroundColor: '#22d3ee',
                    borderColor: '#22d3ee',
                    borderWidth: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems:'center',
                    padding: 10,
                    borderRadius: 10,
                    margin: 5,
                    width: '45%'
                  }}
                >
                  <Text style={{color: '#22d3ee'}}>Fale com o motorista</Text>
                </TouchableOpacity>
              )}

          </View>
        </View>
      )}
      {isCaht && (
        // <View style={styles.container}>
          <Chat 
            fecharAbrirChat={fecharAbrirChat} order={novaOrder} idTransacao={idTransacao}
          />
        // </View>
      )}
      </>
  );
}

export default CorridaAberta

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position:'relative'
  },

  InfoGeralTop: {
    position: 'absolute',
    top: Platform.select({ ios: 40, android: 20 }),
    // padding: 15,
    left: 0,
    width: '100%',
    zIndex: 99999
},
});

