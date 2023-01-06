import React, { useEffect, useState, useRef, AppState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StyleSheet, View, Dimensions, Platform, Image, TouchableOpacity} from 'react-native';
import * as Location from 'expo-location';
import Search from '../Search';
import Directions from '../Directions';
import { getPixelSize } from '../utils';
import markerImage from '../../../assets/marker.png';
import carPng from '../../../assets/car.png';
import car2Png from '../../../assets/car-2-a.png';
import locationIcon from '../../../assets/location-pin-2.png';
import atualPng from '../../../assets/atual.png';
import atual2Png from '../../../assets/atual2.png';
import backImage from '../../../assets/back.png';
import styled, { css } from 'styled-components/native';
// import Geocoder from 'react-native-geocoding';
import Details from '../../componets/Details';
import Esperando from '../../componets/Esperando';
import { MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons"
import { Text, Button } from "native-base";

import { useAuth } from '../../contexts/auth';
import Checkout from '../../pages/Checkout';
import MapView, { Marker, PROVIDER_GOOGLE }from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
// Geocoder.init("AIzaSyA5E67B45xsd69Z2SKIhWuVbVlb736lWvk"); 

const MapMonitoramento = ({distanciaTempo}) => {

    const {
        region, 
        location, 
        yourLocation, 
        novaOrder, 
        user, 
        localizacaoMotorista
    } = useAuth()
    // console.log('yourLocation yourLocation', region, location, yourLocation, novaOrder, localizacaoMotorista)
    // const isFocused = useIsFocused();
    // const [region, setRegion] = useState(null)
    // const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [destination, setDestination] = useState(null);
    const [duration, setDuration] = useState(null);
    const [distancia, setDistancia] = useState(null);
    const [mapView, setMapView] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [dadosCorrida, setDadosCorrida] = useState(null);
    const [valor, setValor] = useState(0);
    const [telaConfirmacao, setTelaConfirmacao] = useState(false);
    const [loadingMap, setLoadingMap] = useState(false);
    const map = useRef();

    const { width, height } = Dimensions.get('window');

    const LATITUDE_DELTA = 0.0922;
    const ASPECT_RATIO = width / height;

    // useEffect(() => {
    //     console.log('regionregionregion', region)
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         setTelaConfirmacao(false)
    //     });
    
    //     // Return the function to unsubscribe from the event so it gets removed on unmount
    //     return unsubscribe;
    // }, [navigation]);

    const onRegionChange = (region) => {
        // console.log('Region ', region)
    }

    // const converterMinuto = (min) => {
    //     if(min === 0){
    //         return 1 +'min'
    //     }
    //     if(min <= 60){
    //         return min +'min'
    //     }else{
    //         return parseFloat(min / 60).toFixed(2) + 'hs'
    //     }
    // }

    // const converterKm = (km) => {
    //     if(Math.floor(km) === 0){
    //         var decPart = (km+"").split(".")[1]
    //         return decPart + 'm'
    //     }else{
    //         return Math.floor(km) + 'km'
    //     }
    // }

    return (
        <View style={styles.container}>
            {/* <Text style={{zIndex: 99999}}>
                {localizacaoMotorista?.logitude}
                {localizacaoMotorista?.latitude}
            </Text> */}
            {/* {mapView && (
                <MapView 
                    provider={PROVIDER_GOOGLE}
                    style={styles.map} 
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            )} */}
            {/* <TouchableOpacity onPress={() => setMapView(!mapView)}>
                <Text>Map</Text>
            </TouchableOpacity> */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
                }}
                // initialRegion={region}
                // region={region}
                onRegionChange={onRegionChange}
                showsUserLocation
                mapType={'standard'}
                rotateEnabled={true}
                scrollEnabled={true}
                zoomEnabled={true}
                showsCompass={true}
                showsBuildings={true}
                loadingEnabled={false}
                showsMyLocationButton={true}
                ref={map}
            >
                {localizacaoMotorista && (novaOrder.data.status != 'PEGOUPASSAGEIRO') && (
                    <MapViewDirections
                        // lineCap="square"
                        lineDashPattern={[0]}
                        origin={localizacaoMotorista}
                        waypoints={ localizacaoMotorista ? (localizacaoMotorista.length > 2) ? localizacaoMotorista.slice(1, -1): undefined : ''}
                        destination={region}
                        apikey={'AIzaSyAQAGqFeeThBCPGZznbTg6QpcutU1nrDXA'}
                        strokeWidth={3}
                        strokeColor="green"
                        mode={'DRIVING'}
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            // console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            // console.log(`Distance: ${result.distance} km`)
                            // console.log(`Duration: ${result.duration} min.`)

                            map.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                    top: getPixelSize(50),
                                    right: getPixelSize(50),
                                    left: getPixelSize(50),
                                    bottom: getPixelSize(350),
                                },
                            });

                            setLoadingMap(true)
                            distanciaTempo({'distancia': result.distance, 'duracao': Math.floor(result.duration)})
                        }}
                        onError={(errorMessage) => {
                        console.log('GOT AN ERROR', errorMessage);
                        }}
                    />
                )}
                {localizacaoMotorista && (
                    <Marker
                        coordinate={{ 
                            latitude : localizacaoMotorista?.latitude , 
                            longitude : localizacaoMotorista?.longitude
                        }}
                        flat={true}
                        anchor={{ x: 0, y: 0 }}
                        image={car2Png}
                        title={'Motorista'}
                        rotation={0}
                    >
                    </Marker>
                )}
                {localizacaoMotorista && (novaOrder.data.status === 'PEGOUPASSAGEIRO') && (
                    <Directions 
                        origin={{ latitude : localizacaoMotorista?.latitude , longitude : localizacaoMotorista?.longitude}}
                        destination={novaOrder.data.destination}
                        onReady={result => {
                            // console.log('DADOS DA VIAGEM', result, region, destination)
                            // console.log(`Distance: ${result.distance} km`)
                            // console.log(`Duration: ${result.duration} min.`)
                            // setDistancia(result.distance);
                            // setDuration(Math.floor(result.duration));
                            setLoadingMap(true)
                            distanciaTempo({'distancia': result.distance, 'duracao': Math.floor(result.duration)})
                            map.current.fitToCoordinates(result.coordinates, {
                                edgePadding: {
                                top: getPixelSize(50),
                                right: getPixelSize(50),
                                left: getPixelSize(50),
                                bottom: getPixelSize(350),
                                },
                            });
                        }}
                    />
                )}
                {novaOrder.data.status === 'PEGOUPASSAGEIRO' && (
                    <Marker title={'Destino'} coordinate={novaOrder.data.destination} anchor={{ x: 0, y: 0 }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50
                            }}
                            source={locationIcon}
                        />
                    </Marker>
                )}
            </MapView>
            {!loadingMap && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 129, 5, 0.69)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{fontSize: 23, color: '#fff'}}>Aguarde!</Text>
                </View>
            )}
            {/* {region && (
                <MapView
                    style={styles.map}
                    region={region}
                    // onRegionChange={onRegionChange}
                    mapType={'standard'}
                    showsUserLocation
                    loadingEnabled
                    styles={{
                        textInputContainer: {
                        backgroundColor: 'grey',
                        },
                        textInput: {
                        height: 38,
                        color: '#5d5d5d',
                        fontSize: 16,
                        },
                        predefinedPlacesDescription: {
                        color: '#1faadb',
                        },
                    }}
                    ref={map}
                >
                     {destination && (
                         <>
                            <Directions 
                                origin={{latitude: region.latitude, longitude: region.longitude}}
                                destination={{latitude: destination.latitude, longitude: destination.longitude}}
                                onReady={result => {
                                    console.log('DADOS DA VIAGEM', result, region, destination)
                                    console.log(`Distance: ${result.distance} km`)
                                    console.log(`Duration: ${result.duration} min.`)
                                    setDistancia(result.distance);
                                    setDuration(Math.floor(result.duration));
                                    map.current.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                        top: getPixelSize(50),
                                        right: getPixelSize(50),
                                        left: getPixelSize(50),
                                        bottom: getPixelSize(350),
                                        },
                                    });
                                }}
                            />
                            <Marker
                                coordinate={destination}
                                anchor={{ x: 0, y: 0 }}
                                image={markerImage}
                            >
                                <LocationBox>
                                    <LocationText>{destination.title}</LocationText>
                                </LocationBox>
                            </Marker>
                            <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                                <LocationBox>
                                    <LocationText>{location}</LocationText>
                                </LocationBox>
                            </Marker>
                         </>
                     )}
                </MapView>
            )}
            
            {destination 
            ? 
            <>
                <View style={styles.infoTop}>
                    <Back onPress={handleBack}>
                        <Image source={backImage} />
                    </Back>
                    <View style={styles.infoTopViagem}>
                        {distancia && duration && (
                            <View>
                                <Text style={{fontWeight: 'bold'}} fontSize="md">{converterMinuto(duration)}</Text>
                                <Text fontSize="xs">{distancia} Km</Text>
                            </View>
                        ) }
                    </View>
                </View>
                {distancia && (
                    <Details 
                        distancia={distancia} 
                        navigation={navigation} 
                        destination={destination}
                        duration={duration}
                        abrirConfirmacao={abrirConfirmacao}
                        yourLocation={yourLocation}
                    /> 
                )}
            </>
            : 
            <>
                <Search onLocationSelected={handleLocationSelected} yourLocation={yourLocation}/>
            </>
            }
            {telaConfirmacao && (
                <View>
                    <Esperando 
                        navigation={navigation}
                        handleMenuTop={handleMenuTop} 
                        handleBack={handleBack}
                        desabilitarTelaEspera={desabilitarTelaEspera}
                    />
                </View>
            )}
           */}
        </View> 
    )
}

export default MapMonitoramento

const ContainerTopo = styled.View`
    display: flex;
    justify-content: center,
`;

const LocationBox = styled.View`
    background: #fff;
    shadow-color: #000;
    shadow-offset: 0 0;
    shadow-opacity: 0.1;
    elevation: 1;
    border: 1px solid #ddd;
    border-radius: 3px;
    flex-direction: row;
    ${Platform.select({
    ios: css`
        margin-top: 20px;
    `,
    android: css`
        margin-top: 10px;
        margin-left: 10px;
    `
    })}
`;

const LocationText = styled.Text`
  margin: 8px 10px;
  font-size: 14px;
  color: #333;
`;

const LocationTimeBox = styled.View`
  background: #222;
  padding: 3px 8px;
`;

const LocationTimeText = styled.Text`
  color: #fff;
  font-size: 12px;
  text-align: center;
`;

const LocationTimeTextSmall = styled.Text`
  color: #fff;
  font-size: 10px;
  text-align: center;
`;

// const InfoTop = styled.View`
//   position: absolute;
//   display: flex;
//   top: ${Platform.select({ ios: 60, android: 40 })};
//   left: 20px;
//   padding: 15px
//   background: #fff;
//   border-radius: 30px;
// `;

const Back = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    background: #fff;
    padding: 15px;
    border-radius: 30px
`;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      flex: 1,
    },
    infoTop: {
        position: 'absolute',
        display: 'flex',
        top: Platform.select({ ios: 60, android: 40 }),
        padding: 15,
        // backgroundColor: '#fff',
        // borderRadius: 30,
        flexDirection: 'row',
        width: '100%'
    },
    infoTopViagem: {
        backgroundColor: '#fff',
        left: 10,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: '#171717',
        shadowOffset: {width: -1, height: 2},
        shadowOpacity: 0.1,
        // shadowRadius: 3,
    }
});
  