import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components/native';
import uberx from "../../../assets/uberx.png";
import { StyleSheet, View, Dimensions, Platform, Image, ScrollView, TouchableOpacity} from 'react-native';
import { Text, Icon, Avatar, HStack, Spinner, Heading, Center} from "native-base";
import {Ionicons, FontAwesome5} from "@expo/vector-icons"
import { useAuth } from '../../contexts/auth';
import enZA from 'date-fns/esm/locale/en-ZA/index.js';
import { rating } from '../../services/rating';

const Details = ({distancia, navigation, destination, duration, abrirConfirmacao, yourLocation}) => {

  const { 
    buscarMotoristaLivre, 
    motoristaLivre, 
    region, 
    semMotorista, 
    primeiraCorrida,
    selected,
    valor,
    valorSemBonus,
    valorBonus,
    setSelected,
    setValor,
    setValorSemBonus,
    setValorBonus,
    statusCorrida,
    user
  } = useAuth()

  // const [ selected, setSelected ] = useState(null)
  // const [ valor, setValor ] = useState(null)
  // const [ valorSemBonus, setValorSemBonus ] = useState(null)
  // const [ valorBonus, setValorBonus ] = useState(20)

  useEffect(() => {
    buscarMotoristaLivre(user)
    // console.log('*** motoristaLivre', motoristaLivre, distancia, yourLocation, destination)

  }, [])

  // const checkout = () => {
  //   navigation.push('Checkout')
  // }


  function valorViagem(km, tarifa){
    var kmString = km.toString();
    // var arr = kmString.split('.'); 
    var arr = kmString.split('.'); 
    var km = arr[0];
    var m = arr[1]
    
    // console.log('tarifa', tarifa, kmString, arr)

    var kmInteger = parseInt(km)
    var mInteger = parseInt(m)

    // calcular KM
    var totalValorKm = kmInteger * tarifa.km
    // console.log('totalValorKm ', totalValorKm)
    // calcular Metros
    var valorMetro = tarifa.km / 1000
    var totalValorM = mInteger * valorMetro

    // console.log('totalCorrida ', valorMetro, totalValorM, tarifa.minimo)

    var totalCorrida = totalValorKm + totalValorM + parseFloat(tarifa.minimo)

    // console.log('totalCorrida ', totalCorrida)

    // console.log('arr ', totalValorKm, totalValorM, totalCorrida)
    return totalCorrida
  }

  function definirVeiculo(item){
    // console.log('Item definir veiculo', item)
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

  const aplicarBonus = (b, vb, vc) => {
    //vc = valor dacorrida b = bonus vb = valor bunus
    var valorDaCorrida = vc
    if(b && vc > vb){
      valorDaCorrida = vc - vb
    }else if(b && vc < vb){
      valorDaCorrida = 0
    }
    return valorDaCorrida
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
      <Container 
        // horizontal={true}
        // contentContainerStyle={{ width: `${100 * 3}%` }}
        // showsHorizontalScrollIndicator={false}
        // scrollEventThrottle={200}
        // decelerationRate="fast"
        // pagingEnabled
        // style={styles.scrollView}
        selected={selected}
      >
        <View >
          {statusCorrida === 'RECUSADO' && (
            <View style={{ padding: 5, marginBottom: 5}}>
                <Text style={{fontWeight:'bold', textAlign: 'center'}}>
                  O Motorista recusou a sua corrida. solicite outro!
                </Text>
            </View>
          )}
            <View style={{ padding: 5, marginBottom: 5}}>
              {primeiraCorrida && (
                <Text style={{fontWeight:'bold', textAlign: 'center', color: 'green', fontSize: 18}}>
                  Bonus de {moedaBR(valorBonus)}
                </Text>
              )}
                <Text style={{fontWeight:'bold', textAlign: 'center'}}>
                  Escolha uma viagem ou deslize para cima para ver mais
                </Text>
                <Text style={{fontWeight:'normal', textAlign: 'center'}} numberOfLines={1}>
                  De: {yourLocation}
                </Text>
                <Text style={{fontWeight:'normal', textAlign: 'center'}} numberOfLines={1}>
                  Para: {destination.title}
                </Text>
            </View>
        </View>
        {motoristaLivre.map((item, key) => (
          <TouchableOpacity 
            onPress={() => {
              // console.log('item item item ', item)
              setSelected(item)
              setValorSemBonus(valorViagem(distancia, item.tarifa))
              if(primeiraCorrida){
                setValor(aplicarBonus(primeiraCorrida, valorBonus, valorViagem(distancia, item.tarifa)))
              }else{
                setValor(valorViagem(distancia, item.tarifa))
              }
            }} 
            key={key} 
            style={{
              width: '100%',
              borderColor: '#dcfce7',
              borderWidth: 1,
              padding: 8,
              borderRadius: 5,
              // marginRight: 5,
              marginBottom: 10,
              backgroundColor: selected?.id == item?.id ? '#a7f3d0' : 'white'
            }}
          >
            <View style={styles.containerDetalhes}>
              <View style={styles.detalhesCarro}>
                <Text style={{fontWeight:'bold', fontSize: 16}}>
                  {item?.tipoVeiculo} {item.delivery === 'Sim' ? '- Faz entregas' : ''}
                </Text>
                {/* <Text style={{fontWeight:'bold', fontSize: 16}}>
                  {item?.tipoVeiculo} {item.delivery === 'Sim' ? '- Faz entregas' : ''} {rating()}
                </Text> */}
                <View style={styles.subDetalhesCarro}>
                  <Text style={{fontWeight:'bold', fontSize: 13}}>
                    {/* {definirVeiculo(item.veiculos).categoria}  */}
                    {item?.veiculos ? item?.veiculos[0].categoria : 'Não carregou'}{' '}
                  </Text>
                  {primeiraCorrida && (
                    <Text style={{fontWeight:'normal', fontSize: 15, textDecorationLine: 'line-through', color:'red'}}>
                      {moedaBR(valorViagem(distancia, item.tarifa))}{' '}
                    </Text>
                  )}
                  {primeiraCorrida && (
                    <Text style={{fontWeight:'bold', fontSize: 14, color:'green'}}>
                    - R$ {moedaBR(valorBonus)} Bonus {''}
                    </Text>
                  )}
                  <Text style={{fontWeight:'bold', fontSize: 19}}>
                    {moedaBR(aplicarBonus( primeiraCorrida, valorBonus, valorViagem(distancia, item.tarifa)))} {''}
                  </Text>
                </View>

                <View style={styles.subDetalhesCarro}>
                  {/* <Text style={{fontWeight:'bold'}}>Honda Civic </Text> */}
                  {item?.veiculos && (
                    <Text>
                      {/* {definirVeiculo(item.veiculos).marca} {definirVeiculo(item.veiculos).modelo} - {definirVeiculo(item.veiculos).placa} */}
                      {item?.veiculos[0]?.marca} {item?.veiculos[0]?.modelo} - {item?.veiculos[0].placa}
                    </Text>
                  )}
                  {/* <Icon
                    as={Ionicons}
                    name="star"
                    color="yellow.500"
                    size={'5'}
                    _dark={{
                      color: "yellow.500",
                    }}
                  /> 
                  <Text>5</Text> */}
                </View>
              </View>
              <View>
                {item?.tipoVeiculo === 'Carro' && (
                  <Icon
                    as={Ionicons}
                    name="ios-car-sport"
                    color="coolGray.800"
                    size={'10'}
                    _dark={{
                      color: "warmGray.50",
                    }}
                  />
                )}
                {item?.tipoVeiculo === 'Moto' && (
                  <Icon
                    as={FontAwesome5}
                    name="motorcycle"
                    color="coolGray.800"
                    style={{width: 50}}
                    size={10}
                    _dark={{
                      color: "warmGray.50",
                    }}
                  />
                  // <Icon 
                  //   size={8} 
                  //   style={{width: 50}} 
                  //   as={FontAwesome5} 
                  //   name="motorcycle" 
                  // />
                )}
              </View>
            </View>
            <View style={styles.containerDetalhesMotorista}>
              <View>
                <Avatar
                  bg="indigo.500"
                  alignSelf="center"
                  size={'10'}
                  source={{
                    uri: item.picture ? item.picture : 'https://eztaxi.com.br/wp-content/uploads/2022/10/cropped-icon.jpg'
                  }}
                >
                  EZ
                </Avatar>
              </View>
              <View style={styles.detalhesCarro}>
                <View style={styles.subDetalhesCarro}>
                  <Text style={{fontWeight:'bold'}}>{item.nome}  {rating(item.avaliacao) ? rating(item.avaliacao) : 0}</Text>
                  <Icon
                    as={Ionicons}
                    name="star"
                    color="coolGray.800"
                    style={{width: 30, marginTop: 4}}
                    size={3}
                    _dark={{
                      color: "warmGray.50",
                    }}
                  />
                </View>
                <View style={styles.subDetalhesCarro}>
                  {/* <Icon
                    as={Ionicons}
                    name="star"
                    color="yellow.500"
                    size={'5'}
                    _dark={{
                      color: "yellow.500",
                    }}
                  /> 
                  <Text>5</Text> */}
                  <View>
                    {/* {item.formas_pagamento.map((item, key) => { */}
                    {item.formas_pagamento.length > 0 && (
                      <Text>
                        {item.formas_pagamento[0]}, {item.formas_pagamento[1]}, {item.formas_pagamento[2]}
                      </Text>
                    )}
                    {item.formas_pagamento.length === 0 && (
                      <Text>
                        Nenhuma forma de pagamento foi definida
                      </Text>
                    )}
                    {/* })} */}
                  </View>
                </View>
              </View>
            </View>
            {/* <RequestButton onPress={() => {abrirModal(item, valorViagem(distancia, item.tarifa))}}>
              <RequestButtonText>SOLICITAR</RequestButtonText>
            </RequestButton> */}
          </TouchableOpacity>
        ))}
        {motoristaLivre.length === 0 && (
          <HStack 
            space={2} 
            justifyContent="center"
          >
            {semMotorista && (
              <Center h="40" w="20" rounded="md">
                <Spinner color="indigo.500" accessibilityLabel="Loading" />
                <Heading color="indigo.500" fontSize="md">
                  Buscando
                </Heading>
              </Center>
            )}
            {!semMotorista && (
              <Center style={{width: '100%'}} h="40" w="20" rounded="md">
                <Spinner color="indigo.500" accessibilityLabel="Loading" />
                <View>
                  <Heading color="indigo.500" textAlign={'center'} fontSize="md">
                    No momento não há nenhum Carro ou Moto diponível, deixe esta tela aberta que vamos atualizar assim que tiver um veículo disponível.
                  </Heading>
                </View>
              </Center>
            )}
          </HStack>
        )}
      </Container>
      {selected && (
          <View style={styles.btnConfirmar}>
              <RequestButton onPress={() => {
                // abrirModal(item, valorViagem(distancia, item.tarifa))
                abrirConfirmacao(
                  selected, 
                  valor, 
                  distancia,
                  destination,
                  duration,
                  yourLocation,
                  region,
                  primeiraCorrida,
                  valorSemBonus
                )
              }}>
                <RequestButtonText>Confirmar {selected.veiculos[0].categoria} {moedaBR(valor)}</RequestButtonText>
              </RequestButton>
          </View>
      )}
    </>
  )
}

export default Details

const Container = styled.ScrollView`
  background: #fff;
  height: 400px;
  width: 100%;
  position: absolute;
  bottom: ${props => props.selected ? '100px' : '0px'};
  shadow-color: #000;
  shadow-offset: 0 0;
  shadow-opacity: 0.2;
  shadow-radius: 10;
  elevation: 3;
  border: 1px solid #ddd;
  padding: 8px 8px 100px 8px;
`;

// const TypeTitle = styled.Text`
//   font-size: 20px;
//   color: #222;
// `;

// const TypeDescription = styled.Text`
//   color: #666;
//   font-size: 14px;
// `;

const TypeImage = styled.Image`
  width: 50px;
  height: 50px;
  margin: 5px;
`;

const RequestButton = styled.TouchableOpacity`
  background: #222;
  justify-content: center;
  align-items: center;
  height: 60px;
  align-self: stretch;
  margin-top: 10px;
  border-radius: 5px;
`;

const RequestButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  text-transform: uppercase
`;

const styles = StyleSheet.create({
  items:{
    width: '100%',
    borderColor: '#dcfce7',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    // marginRight: 5,
    marginBottom: 10
  },
  containerDetalhes: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    marginBottom: 10
  },
  containerDetalhesMotorista: {
    // backgroundColor: '#F5FFFA',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    marginBottom: 10
  },
  detalhesCarro:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: 5,
    marginRight: 5
  },
  subDetalhesCarro:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  btnConfirmar:{
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    shadowColor: "gray",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    },
    zIndex: 9999
    // height: 40
  }
})