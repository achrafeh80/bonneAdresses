import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get('http://localhost:3000/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const form = new FormData();
      form.append('photo', {
        uri: result.uri,
        name: 'profile.jpg',
        type: 'image/jpeg'
      });
      await axios.post('http://localhost:3000/api/v1/users/me/photo', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchProfile();
    }
  };

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  if (!profile) return null;
  return (
    <View style={styles.container}>
      <Text>Name: {profile.name}</Text>
      {profile.profilePicture && (
        <Image source={{ uri: `http://localhost:3000/api/v1/images/${profile.profilePicture}` }} style={styles.avatar} />
      )}
      <Button title="Change Profile Picture" onPress={pickImage} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, margin: 16 }
});
