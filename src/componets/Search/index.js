import React, { useEffect, useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { StyleSheet, View, Text, Dimensions, Platform} from 'react-native';
import {
  IconButton,
  Icon
} from "native-base";
import {AntDesign, EvilIcons, FontAwesome5, MaterialIcons, Ionicons} from "@expo/vector-icons"

const Search = ({ onLocationSelected, yourLocation, primeiraCorrida }) => {

    const [searchFocused, setSearchFocused] = useState(false)

    const GOOGLE_PLACES_API_KEY = 'AIzaSyA5E67B45xsd69Z2SKIhWuVbVlb736lWvk';

    const homePlace = {
      description: 'Casa',
      geometry: { location: { lat: -2.5157602115976707, lng: 2.4597668 } },
    };
    const workPlace = {
      description: 'Trabalho',
      geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
    };

    const EmptyListMessage = ({ item }) => {
      return (
        // Flat List Item
        <Text style={{
          padding: 10,
          fontSize: 18,
          textAlign: 'center',
        }}>
          Nenhuma resultado foi encontrado!
        </Text>
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.location}>
          <Icon as={Ionicons} size={21} name="location" />
          <Text numberOfLines={1}>{yourLocation}</Text>
        </View>
        <GooglePlacesAutocomplete
          placeholder="Digie o endereço ou clique no destino"
          placeholderTextColor="#333"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          renderDescription={row => row.description} // custom description renderZ
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={200}
          onPress={onLocationSelected}
          currentLocationLabel={'Sua localização'}
          //currentLocation={true}
          enableHighAccuracyLocation={true}
          autoFillOnNotFound={true}
          // returnKeyType = "next"
          // numberOfLines={1}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: "br",
            components: 'country:br',
          }}
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
          }}
          textInputProps={{
            onFocus: () => {
              setSearchFocused(true);
            },
            onBlur: () => {
              setSearchFocused(false)
            },
            getCurrentLocation: () => {
              console.log('******')
            },
            autoCapitalize: "none",
            autoCorrect: false,
          }}
          // listViewDisplayed
          fetchDetails={true}
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
          //GooglePlacesSearchQuery={ {rankby: 'distance', type: 'restaurant'} }
          enablePoweredByContainer={false}
          isRowScrollable={true}
          // keepResultsAfterBlur={true}
          listUnderlayColor={'blue'}
          //predefinedPlaces={[homePlace, workPlace]}
          //predefinedPlacesAlwaysVisible={true}
          ListEmptyComponent={EmptyListMessage}
          onNotFound={EmptyListMessage}
          textInputHide={false}
          styles={{
            container: {
              flex: 1,
              padding: 15
            },
            textInputContainer: {
              flexDirection: 'row',
            },
            textInput: {
              backgroundColor: '#FFFFFF',
              height: 44,
              borderRadius: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
              fontSize: 15,
              flex: 1,
            },
            poweredContainer: {
              justifyContent: 'flex-end',
              alignItems: 'center',
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
              borderColor: '#c8c7cc',
              borderTopWidth: 0.5,
            },
            powered: {},
            listView: {},
            row: {
              backgroundColor: '#FFFFFF',
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            separator: {
              height: 0.5,
              backgroundColor: '#c8c7cc',
            },
            description: {},
            loader: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              height: 20,
            },
          }}
        />
        {primeiraCorrida && (
          <View style={styles.location}>
            <Icon color={'yellow.500'} as={Ionicons} size={21} name="star" />
            <Text numberOfLines={1}> Você tem até R$ 20,00 para a sua 1° corrida</Text>
          </View>
        )}
      </View>
    )
}
export default Search

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.select({ ios: 100, android: 80 }),
    width: "100%"
  },
  location:{
    marginHorizontal: 20,
    paddingBottom: 5,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden'
  }
})