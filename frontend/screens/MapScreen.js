import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const fetchAddresses = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get('http://localhost:3000/api/v1/addresses/public', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAddresses(res.data);
  };

  useEffect(() => {
    fetchLocation();
    fetchAddresses();
  }, []);

  if (!location) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }}>
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You" />
        {addresses.map(addr => (
          <Marker key={addr._id} coordinate={{ latitude: addr.location.latitude, longitude: addr.location.longitude }} title={addr.title} />
        ))}
      </MapView>
    </View>
  );
}
