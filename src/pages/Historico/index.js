import { StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, ActivityIndicator, TouchableOpacity, TextComponent} from 'react-native';
import { 
  Button, 
  Icon,
  // ScrollView,
  VStack,
  Center,
  useTheme,
  Heading,
  NativeBaseProvider,
  Flex,
  Input, 
  Stack,
  FormControl,
  WarningOutlineIcon,
  Avatar,
  Spinner,
  FlatList,
  HStack,
  Box,
  Spacer,
  Badge
} from "native-base";
import {useAuth} from '../../contexts/auth';
import { getAuth, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { useForm, Controller } from 'react-hook-form';
import { format, parseISO, parseJSON, parse} from 'date-fns';
import InfoOrder from '../../componets/InfoOrder'

const Historico = ({ navigation }) => {
  const {user, updateUser, loadi, historicoCorridas, historico} = useAuth()
  // const { colors } = useTheme()
  // const [formData, setData] = useState({});
  // const [data, setData] = useState(historico);
  // const [errors, setErrors] = useState({});
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const auth = getAuth();
  const userLogado = auth.currentUser;

  const [isFetching, setIsFetching] = useState(false);

  const { register, formState: { errors }, handleSubmit, control, setValue, watch } = useForm();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // alert('aqui')
      historicoCorridas(user.id)
    });

    // console.log('historico ', historico)
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  
  // useEffect(() => {
  //   console.log('historico ', historico, typeof historico)
  //   historicoCorridas(user.id)
  // }, []);


  function abrirModal(){
    setShowModal(!showModal)
  }

  function chamarTelaChat(props){
    setShowModal(!showModal)
    console.log('Props chamarTelaChat ', props)
    navigation.navigate('Chat',{
      idMotorista: props.data.dadosCorrida.id,
      nomeMotorista: props.data.dadosCorrida.nome,
      pictureMotorista: props.data.dadosCorrida.picture,
      idTransacao: props.id
    });
  }


  useEffect(() => {
    // console.log('User', user)
    // setValue('nome', user.name)
    // setValue('contato', user.contato)
  }, []);

  function reautenticarUsuario(){
    reauthenticateWithCredential(userLogado, credential).then((e) => {
      // User re-authenticated.
      console.log('usuario reautenticado')
    }).catch((error) => {
      // An error ocurred
      // ...
    });
  }



  const convertDate = (userDate) => {
    const newDate = new Date(userDate.seconds*1000)
    const newDateFormated = format(newDate, 'dd/MM/yy HH:mm')
    // console.log('format', newDateFormated)
    // return new Date(userDate.seconds*1000).toLocaleDateString()
    return newDateFormated
  }

  function definirVeiculo(item){
    for (let i = 0; i < item.length; i++) {
      const element = item[i];
      // console.log('Veiculo ', element)
      if(element.status){
        return {
          ano: element.ano,
          categoria: element.categoria,
          marca: element.marca,
          modelo: element.modelo,
          placa: element.placa,
          tipo: element.tipo
        }
      }
    }
  }

  const abrirAvaliacao = (dadoscorrida) => {
    navigation.navigate('Avaliacao',{
      dadoscorrida: dadoscorrida,
    });
  }
  
  const fetchData = () => {
    historicoCorridas(user.id)
    setIsFetching(false);
  };

  const onRefresh = () => {
    setIsFetching(true);
    fetchData()
  };

  function definirAceite(value){
    if(value){
      return 'Aceitou'
    }else if( !value ){
      return 'Cancelado'
    }else{
      return 'Pendente'
    }
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
    <SafeAreaView style={styles.container}>
      <View style={styles.viewContent}>
        <View style={styles.containerHistorico}>
            <View style={styles.mainHitorico}>
              {historico && (
                <FlatList 
                  style={{
                    flex: 1
                  }}
                  data={historico} 
                  renderItem={({item}) => 
                    <Box 
                      borderBottomWidth="1" 
                      borderLeftWidth="4"
                      borderLeftColor={item.data.aceite ? 'success.600' : 'error.700'}
                      paddingLeft="1"
                      _dark={{borderColor: "gray.600"}} 
                      borderColor="coolGray.200" 
                      pl="4" 
                      pr="5" 
                      py="2"
                      marginBottom={2}
                      // backgroundColor='coolGray.100'
                      width={'100%'}
                      backgroundColor={item.data.status === 'Aberto' ? 'teal.100' : 'coolGray.100'}
                    >
                        <TouchableOpacity
                           onPress={() => {
                            setSelected(item)
                            setShowModal(!showModal)
                           }}
                        >
                          <HStack 
                            space={3} 
                            justifyContent="space-between" 
                            alignItems={'center'}
                            backgroundColor={'red'}
                            paddingRight={100}
                          >
                            {/* <Avatar size="48px" source={{
                              uri: item.data.dadosCorrida.picture ? item.data.dadosCorrida.picture : 'https://eztaxi.com.br/wp-content/uploads/2022/10/cropped-icon.jpg'
                            }} /> */}
                            <Avatar 
                              style={{
                                borderWidth: 5,
                                borderColor: '#a3e635',
                              }}
                              bg="darkBlue.600" 
                              alignSelf="center" 
                              // size="2xl" 
                              source={{
                                uri: item.data.dadosCorrida.picture ? item.data.dadosCorrida.picture : 'https://eztaxi.com.br/wp-content/uploads/2022/10/cropped-icon.jpg'
                              }}
                            >
                              EZ
                            </Avatar>
                            <VStack style={{ width: '70%'}}>
                              <Text >
                                {item.data.dadosCorrida.nome}
                              </Text>
                              <Text style={{fontWeight: 'bold'}}>
                                {item.data.dadosCorrida.veiculos[0].modelo}{'/'}
                                {item.data.dadosCorrida.veiculos[0].placa}
                              </Text>
                              {/* <Text style={{overflow: 'hidden', width: 250}} color="coolGray.600" _dark={{color: "warmGray.200"}} numberOfLines={1}>
                                De: {item.data.yourLocation}
                              </Text>
                              <Text style={{overflow: 'hidden', width: 150}} color="coolGray.600" _dark={{color: "warmGray.200"}}>
                                Para: {item.data.destination.title_secondary}
                              </Text> */}
                            </VStack>
                            <Spacer />
                            <View>
                              <Text fontSize="xs" _dark={{color: "warmGray.50"}} color="coolGray.800" alignSelf="flex-start">
                                {/* {format(parse(item.data.data), 'dd/MM/yyyy')} */}
                                {convertDate(item.data.data)}
                              </Text>
                              <Text fontSize="md" _dark={{color: "warmGray.50"}} color="coolGray.800" alignSelf="flex-end">
                                {/* {format(parse(item.data.data), 'dd/MM/yyyy')} */}
                                {moedaBR(item.data.valor)}
                              </Text>
                            </View>
                          </HStack>
                          <HStack space={3}marginTop={1} padding={1} justifyContent="center" alignItems={'center'}>
                              {item.data.status === 'PENDENTE' && (
                                <Badge >Corrita foi aceita pelo motorista.</Badge>
                              )}
                              {item.data.status === 'ACEITOU' && (
                                <Badge colorScheme="info">Corrita foi aceita pelo motorista.</Badge>
                              )}
                              {item.data.status === 'BUSCANDOPASSAGEIRO' && (
                                <Badge colorScheme="info">Motista a caminho de sua posição atual.</Badge>
                              )}
                              {item.data.status === 'PEGOUPASSAGEIRO' && (
                                <Badge colorScheme="info">Você já está no veículo.</Badge>
                              )}
                              {item.data.status === 'FINALIZADO' && (
                                <Badge colorScheme="success">Corrida finalizada.</Badge>
                              )}
                              {item.data.status === 'RECUSADO' && (
                                <Badge colorScheme="danger">O Motorista cancelou esta corrida.</Badge>
                              )}
                              {item.data.status === 'CANCELADO' && (
                                <Badge colorScheme="danger">Corrida cancelada.</Badge>
                              )}
                              {item.data.taximetro && (
                                <Badge colorScheme="success" alignSelf="center" >Taxímentro</Badge>
                              )}
                          </HStack>
                          {/* {item.data.aceite === null && (
                            <HStack space={3}marginTop={1} padding={1} justifyContent="center" alignItems={'center'}>
                              <Text>
                                Aguardando motorista acaitar
                              </Text>
                            </HStack>
                          )} */}
                        </TouchableOpacity>
                    </Box>
                  }  
                  keyExtractor={item => item.id} 
                  onRefresh={onRefresh}
                  refreshing={isFetching}
                />
              )}
              {!historico && (
                <View style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text>Não possui historico</Text>
                </View>
              )}
            </View>
        </View>
      </View>
      {selected && showModal && (
        <InfoOrder
          showModal={showModal}
          abrirModal={abrirModal}
          selected={selected}
          chamarTelaChat={chamarTelaChat}
          abrirAvaliacao={abrirAvaliacao}
        />
      )}
      {loadi && (
        <View style={styles.loadi}>
            <Spinner size="lg" color="emerald.500" />
            <Text style={{ fontSize: 12, color: 'gray'}}>Aguarde</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Historico

const styles = StyleSheet.create({
  loadi: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: 'white'
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  viewContent: {
    backgroundColor: '#fafafa',
    // backgroundColor: '#fafafa',
    flex: 1,
    // marginHorizontal: 20,
  },
  viewAvatar: {
    backgroundColor: '#a1a1aa',
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '10%',
  },
  containerHistorico: {
    padding: 10,
    position: 'absolute',
    top: '10%',
    width: '100%',
    height: '90%',
  },
  mainHitorico: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: -30,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 5,
    shadowColor: "#a1a1aa",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },

});

