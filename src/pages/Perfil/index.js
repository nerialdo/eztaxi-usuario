import { StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Platform} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
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
  Skeleton,
  Progress
} from "native-base";
import { MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons";
import {useAuth} from '../../contexts/auth';
// import { getAuth, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
// import { Asset } from 'expo-asset';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

const Perfil = ({ navigation }) => {
  const {user, updateUser, loadi, expoPushToken, uploadImage2, imagePerfil} = useAuth()
  const { colors } = useTheme()
  const [formData, setData] = useState({});
  const [image, setImage] = useState(null)
  const [imageMeta, setImageMeta] = useState(null)
  const [uploading, setUploading] = useState(false)   

  const [ready, setReady] = useState(false);
  // const [errors, setErrors] = useState({});
  // const auth = getAuth();
  // const userLogado = auth.currentUser;

  const { register, formState: { errors }, handleSubmit, control, setValue, watch } = useForm();

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     alert('aqui')
  //   });

  //   // Return the function to unsubscribe from the event so it gets removed on unmount
  //   return unsubscribe;
  // }, [navigation]);
  

  useEffect(() => {
    console.log('useEffect perfil', user)
    setValue('nome', user?.name)
    setValue('contato', user?.contato)
    setValue('email', user?.email)
  }, [user]);

  // function reautenticarUsuario(){
  //   reauthenticateWithCredential(userLogado, credential).then((e) => {
  //     // User re-authenticated.
  //     console.log('usuario reautenticado')
  //   }).catch((error) => {
  //     // An error ocurred
  //     // ...
  //   });
  // }

  const pickImage = async () => {

    //comprimi a imagem
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, 
    });

    // console.log('Resultato pickImage', result);
    // setImageMeta(result)
    if (!result.cancelled) {
      // setImage(result.uri);

      const manipResult = await manipulateAsync(
        result.uri,
        [
          // { rotate: 180 }, 
          // { flip: FlipType.Horizontal }, 
          {resize: {height: 300, width: 0 }},
          // {
          //   crop:{
          //     height: 300, 
          //     originX: 0, 
          //     originY: 0, 
          //     width: 300
          //   }
          // }
        ],
        { compress: 1, format: SaveFormat.PNG}
      );
      console.log('imagem ====>', manipResult)
      uploadImage2(manipResult.uri, user.id)
      // setImage(manipResult.uri);
    }
  };

  // const uploadImage = async (link) => {

  //   // setImage(link);

  //   // const blob = await new Promise((resolve, reject) => {
  //   //   const xhr = new XMLHttpRequest();
  //   //   xhr.onload = function() {
  //   //     resolve(xhr.response);
  //   //   };
  //   //   xhr.onerror = function() {
  //   //     reject(new TypeError('Network request failed'));
  //   //   };
  //   //   xhr.responseType = 'blob';
  //   //   xhr.open('GET', image, true);
  //   //   xhr.send(null);
  //   // })
  //   // console.log('Blob', blob, image)
  //   uploadImage2(link)
  //   // const ref = firebase.storage().ref().child(`Pictures/Image1`)
  //   // const snapshot = ref.put(blob)
  //   // snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED,
  //   //   ()=>{
  //   //     setUploading(true)
  //   //   },
  //   //   (error) => {
  //   //     setUploading(false)
  //   //     console.log(error)
  //   //     blob.close()
  //   //     return 
  //   //   },
  //   //   () => {
  //   //     snapshot.snapshot.ref.getDownloadURL().then((url) => {
  //   //       setUploading(false)
  //   //       console.log("Download URL: ", url)
  //   //       setImage(url)
  //   //       blob.close()
  //   //       return url
  //   //     })
  //   //   }
  //   //   )
  // }


  const onSubmit = (data) => {
    updateUser(user.id, data, expoPushToken)
  };

 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {/* <View style={styles.container}>
        {image && <Image source={{uri: image}} style={{width: 170 , height: 200}}/>}
        <Button title='Select Image' onPress={pickImage} />
        {!uploading ? <Button title='Upload Image' onPress={() => {uploadImage(image)}} />: <ActivityIndicator size={'small'} color='black' />}
      </View> */}
        {imagePerfil?.progress > 0 && (
          <Progress colorScheme="secondary" value={imagePerfil?.progress} />
        )}
        <View style={styles.viewAvatar}>
        {/* <LinearGradient 
          // style={{
          //   height: 45, 
          //   width: 100, 
          //   marginTop: 15, 
          //   borderRadius: 5
          // }}
          style={styles.viewAvatar}
          colors={['#3454fd','#1b3be0']}
        > */}
          <Center style={{marginTop: 10, marginBottom: 20}}>
            <View style={{position:'relative', marginBottom: 20}}>
              {!imagePerfil?.file && (
                <Skeleton onPress={pickImage} width={130} height={130} mb="3" rounded="65" />
              )}
              {imagePerfil?.file && (
                <Avatar 
                  onPress={pickImage}
                  style={{
                    borderWidth: 5,
                    borderColor: '#a3e635',
                  }}
                  bg="darkBlue.600" 
                  alignSelf="center" 
                  size="2xl" 
                  source={{
                    uri: imagePerfil?.file ? imagePerfil?.file : 'https://eztaxi.com.br/wp-content/uploads/2022/10/cropped-icon.jpg'
                  }}
                >
                  EZ
                </Avatar>
              )}
              {Platform.OS === 'ios' && (
                <Icon  onPress={pickImage} style={{position: 'absolute', bottom: 0, right: 10}} as={AntDesign} size="30" name="camera" color="primary.50" _dark={{
                  color: "primary.50"
                }} />
              )}
            </View>
            <Heading fontSize={20} textAlign="center" color={'white'}>
              {user?.name ? user?.name : 'Adicione os seus dados'}
            </Heading>
            {/* <Text style={{color: 'white'}}>{user?.email}</Text> */}
          </Center>
        {/* </LinearGradient> */}
        </View>
        <View style={styles.containerForm}>
            <View style={styles.mainForm}>
              <FormControl style={{marginBottom: 10}} isRequired isInvalid={'nome' in errors}>
                <FormControl.Label _text={{bold: true}}>Qual o seu nome?</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange }, onBlur, value }) => (
                    <Input
                      style={styles.form}
                      onBlur={onBlur}
                      placeholder="Precisamos do seu nome"
                      onChangeText={(val) => {onChange(val)}}
                      value={watch("nome")}
                    />
                  )}
                  name="nome"
                  rules={{ required: 'Campo obrigatório', minLength: 3 }}
                  defaultValue=""
                />
              </FormControl>
              <FormControl style={{marginBottom: 10}} isRequired isInvalid={'contato' in errors}>
                <FormControl.Label _text={{bold: true}}>Telefone/WhatsApp</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange }, onBlur, value }) => (
                    <Input
                      style={styles.form}
                      onBlur={onBlur}
                      placeholder="(00)0000-0000"
                      onChangeText={(val) => {onChange(val)}}
                      value={watch("contato")}
                    />
                  )}
                  name="contato"
                  rules={{ required: 'O seu contato é obrigatório', minLength: 3 }}
                  defaultValue=""
                />
              </FormControl>
              <FormControl style={{marginBottom: 10}} isRequired isInvalid={'email' in errors}>
                <FormControl.Label _text={{bold: true}}>Email</FormControl.Label>
                <Controller
                  control={control}
                  render={({ field: { onChange }, onBlur, value }) => (
                    <Input
                      style={styles.form}
                      onBlur={onBlur}
                      editable={false}
                      onChangeText={(val) => {onChange(val)}}
                      value={watch("email")}
                    />
                  )}
                  name="email"
                  rules={{ required: 'O email é obrigatório', minLength: 3 }}
                  defaultValue=""
                />
              </FormControl>
              <LinearGradient 
                style={{
                  width: '100%',
                  borderRadius: 10,
                  marginTop: 20
                }}
                colors={['#3454fd','#1b3be0']}
              >
                <TouchableOpacity 
                  style={{
                    backgroundColor: 'transparent',
                    height: 50,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={{color:'white'}}>Atualizar</Text>
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity 
                style={{
                  backgroundColor: 'transparent',
                  height: 50,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30
                }}
                onPress={() => {
                  Linking.openURL('https://eztaxi.com.br/excluir-conta');
                }}
              >
                <Text style={{color:'red'}}>Excluir conta</Text>
              </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
      {/* {loadi && (
        <View style={styles.loadi}>
            <Spinner size="lg" color="emerald.500" />
            <Text style={{ fontSize: 12, color: 'gray'}}>Aguarde</Text>
        </View>
      )} */}
    </SafeAreaView>
  );
}

export default Perfil

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
  scrollView: {
    backgroundColor: '#fafafa',
    // marginHorizontal: 20,
  },
  viewAvatar: {
    backgroundColor: '#3454fd',
    // backgroundColor: '#a1a1aa',
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
    // minHeight: 500
  },
  containerForm: {
    padding: 10
  },
  mainForm: {
    backgroundColor: 'white',
    marginTop: -50,
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
  form:{
    height: 40,
    fontSize: 19
    // backgroundColor: '#f4f4f5',
    // marginBottom: 20
  }
});

