import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Platform} from 'react-native';
import MapViewDirections from "react-native-maps-directions";
import { Box, Collapse, Alert, VStack, HStack, Text, IconButton, CloseIcon, Button, Avatar} from 'native-base';
import { useAuth } from '../../contexts/auth';

const AlertMsg = ({ novaMsg, fecharAbrirChat }) => {
  const [ultimaMensagem, setUltimaMensagem] = useState(null);
  const {desativarAlertaMsg, messages, user} = useAuth()


  useEffect(() => {
    // console.log( 'tetetetetetetet >>>>>>>', novaMsg, messages, user)
    setUltimaMensagem(filtrarMsg(messages))
    // setShow(novaMsg)
  }, [ultimaMensagem])

  const filtrarMsg = (arr) => {
    var mensagemUsuario =  arr.filter(function(obg) {
      return obg.user._id != user?.id
    });
    // console.log('()()()()(,', mensagemUsuario[0])
    return mensagemUsuario[0]
  }

  const AlertApp = () => {
      return <Box w="100%">
          <Collapse isOpen={novaMsg}>
            <Alert w="100%" maxW="1000" background={'white'}>
              <VStack space={1} flexShrink={1} w="100%">
                <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                  <HStack flexShrink={1} space={2} alignItems="center">
                      <Avatar bg="amber.500" onPress={() => {
                        fecharAbrirChat()
                        desativarAlertaMsg()
                      }} source={{
                      uri: ultimaMensagem?.user.avatar
                      }} size="md">
                          NB
                          <Avatar.Badge bg="green.500" />
                      </Avatar>
                      <VStack>
                          <Text onPress={() => {
                            fecharAbrirChat()
                            desativarAlertaMsg()
                          }} fontSize="md" fontWeight="medium" _dark={{
                              color: "coolGray.800"
                          }}>
                              {ultimaMensagem ? ultimaMensagem?.user.name : 'Carregando'}
                          </Text>
                          <Text onPress={() => {
                            fecharAbrirChat()
                            desativarAlertaMsg()
                          }} fontSize="xs" fontWeight="normal" _dark={{
                              color: "coolGray.800"
                          }}>
                              {ultimaMensagem ? ultimaMensagem?.text : 'Carregando'}
                          </Text>
                      </VStack>
                  </HStack>
                  <IconButton variant="unstyled" _focus={{
                  borderWidth: 0
                }} icon={<CloseIcon size="3" color="coolGray.600" />} onPress={() => desativarAlertaMsg()} />
                </HStack>
                {/* <Box pl="6" _dark={{
                  _text: {
                      color: "coolGray.600"
                  }
                }}>
                  Your coupon could not be processed at this time.
                </Box> */}
              </VStack>
            </Alert>
          </Collapse>
          {/* <Button size={"sm"} onPress={() => setShow(true)} mt={8} mx="auto">
            Re-Open
          </Button> */}
        </Box>;
  }
  
  return (
      <AlertApp />
  )
};

export default AlertMsg