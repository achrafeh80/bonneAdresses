import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function CreateAddressScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  const useCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission denied');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
  };

  const createAddress = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('isPublic', isPublic);
    form.append('latitude', location.latitude);
    form.append('longitude', location.longitude);
    if (photo) {
      form.append('photo', {
        uri: photo,
        name: 'address.jpg',
        type: 'image/jpeg'
      });
    }
    try {
      await axios.post('http://localhost:3000/api/v1/addresses', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigation.goBack();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Create Address</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <View style={styles.checkboxContainer}>
        <Button title={isPublic ? "Make Private" : "Make Public"} onPress={() => setIsPublic(!isPublic)} />
        <Text style={{ marginLeft: 8 }}>{isPublic ? 'Public' : 'Private'}</Text>
      </View>
      <Button title="Pick Photo" onPress={pickImage} />
      <Button title="Use Current Location" onPress={useCurrentLocation} />
      {location && <Text>Location: {location.latitude}, {location.longitude}</Text>}
      <Button title="Create" onPress={createAddress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, marginBottom: 8, padding: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 }
});
