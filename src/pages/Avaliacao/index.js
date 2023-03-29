import React, {useState, useEffect} from 'react'; 
import { 
  SafeAreaView, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
} from 'react-native'; 

import { 
  TextArea,
  Box,
  Stack,
  ScrollView ,
  Center,
  VStack,
  Avatar,
  Heading
} from "native-base";
import {useAuth} from '../../contexts/auth';

const Avaliacao = ({route, navigation}) => {
  const {user, salvarAvaliacao, atualizarAvaliacaoOrder} = useAuth()
  const [defaultRating, setDefaultRating] = useState(1); 
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]); 
  const [text, onChangeText] = useState('');
  const {dadoscorrida} = route.params;
  console.log('++++==', dadoscorrida)


  useEffect(() => {
    // if(avaliacaoCadastrada)
    //   setDefaultRating(avaliacaoCadastrada?.nota)
    //   onChangeText(avaliacaoCadastrada?.avaliacao)
  }, []);

  function agoraNao(d){
    atualizarAvaliacaoOrder(d.id)
    navigation.goBack()
  }

  const chamaSalvarAvaliacao = (dados, nota, t) => {
      // console.log(dados, nota, t)
      salvarAvaliacao(dados, nota, t)
  }
  const RatingBar = () => { 
    return ( 
      <View style={styles.ratingBarStyle}> 
        {maxRating.map((item, key) => { 
          return ( 
            <TouchableOpacity 
              activeOpacity={0.7} 
              key={item} 
              onPress={() => setDefaultRating(item)}> 
              <Image 
                style={styles.starImageStyle} 
                source={ 
                  item <= defaultRating 
                    ? require('../../../assets/star-filled.png') 
                    : require('../../../assets/star.png') 
                } 
              /> 
            </TouchableOpacity> 
          ); 
        })} 
      </View> 
    ); 
  }; 
  
  return ( 
    <SafeAreaView style={styles.container}> 
      <View style={styles.container}> 
        <Center>
          <VStack space={2} alignItems={{
            base: "center",
            md: "flex-start"
          }}>
            <Avatar alignSelf="center" bg="amber.500" size="lg" source={{
            uri: dadoscorrida?.data?.dadosCorrida?.picture
          }}>
              EZ
            </Avatar>
            <Heading size="sm">{dadoscorrida?.data?.dadosCorrida?.nome}</Heading>
          </VStack>
        </Center>
        <Text style={styles.textStyle}> 
          Avalie a sua experiência 
        </Text> 
        <RatingBar /> 
        <Text style={styles.textStyle}> 
          {defaultRating} / {Math.max.apply(null, maxRating)} 
        </Text> 
        <Box alignItems="center" w="100%">
          <Stack marginTop={3} space={2.5} w="75%" maxW="300">
            <Box>
              <TextArea value={text} onChangeText={onChangeText} aria-label="t1" numberOfLines={4} placeholder="Diga como foi." isInvalid _dark={{
              placeholderTextColor: "gray.300"
            }} mb="5" />
            </Box>
          </Stack>
        </Box>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={styles.buttonStyle} 
          onPress={() => {
            chamaSalvarAvaliacao(dadoscorrida, defaultRating, text)
          }}> 
          <Text style={styles.buttonTextStyle}> 
            Enviar Avaliação
          </Text> 
        </TouchableOpacity> 
        <TouchableOpacity 
          // activeOpacity={0.7} 
          // style={styles.buttonStyle} 
          onPress={() => {
            agoraNao(dadoscorrida)
          }}> 
           <Text style={{textAlign: 'center', padding: 5, marginTop: 10, color: 'gray'}} fontSize="md">Agora não</Text>
        </TouchableOpacity> 
      </View> 
    </SafeAreaView> 
  ); 
}; 

export default Avaliacao

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: 'white', 
    padding: 10, 
    justifyContent: 'center', 
    textAlign: 'center', 
  }, 
  textStyle: { 
    textAlign: 'center', 
    fontSize: 23, 
    color: '#000', 
    marginTop: 15, 
  }, 
  buttonStyle: { 
    justifyContent: 'center', 
    flexDirection: 'row', 
    marginTop: 30, 
    padding: 15, 
    backgroundColor: 'green', 
  }, 
  buttonTextStyle: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 19
  }, 
  ratingBarStyle: { 
    justifyContent: 'center', 
    flexDirection: 'row', 
    marginTop: 30, 
  }, 
  starImageStyle: { 
    width: 40, 
    height: 40, 
    resizeMode: 'cover', 
  }, 
});