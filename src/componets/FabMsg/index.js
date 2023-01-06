import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { StyleSheet, View, Dimensions, Platform} from 'react-native';
import { 
  Box, Fab, Center, Icon
} from "native-base";
import {AntDesign, EvilIcons, FontAwesome5, MaterialIcons, Ionicons} from "@expo/vector-icons"
import {useAuth} from '../../contexts/auth';

import styled, { css } from 'styled-components/native';

const FabMsg = ({ }) => {
  const {user} = useAuth()

  return (
    <Center>
        <View style={{marginTop: '10%', width: '100%', zIndex: 99999}}>
          <Fab 
            style={{ 
              backgroundColor: 'green',
              zIndex: 99999
            }} 
            renderInPortal={false} 
            shadow={2} 
            placement="top-right" 
            size="sm" 
            icon={
              <Icon 
                color="white" 
                as={MaterialIcons} 
                name="comment" 
                size="4" 
              />
            } 
            label="Nova mensagem" 
          />
        </View>
    </Center>
  );
}

export default FabMsg

const IconMenu = styled.TouchableOpacity`
  padding: 5px
`;