import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

export default function AddressDetailScreen({ route, navigation }) {
  const { addressId } = route.params;
  const [address, setAddress] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState('5');
  const [images, setImages] = useState([]);

  const fetchAddress = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get(`http://localhost:3000/api/v1/addresses/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAddress(res.data);
  };

  const fetchComments = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get(`http://localhost:3000/api/v1/comments/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setComments(res.data);
  };

  useEffect(() => {
    fetchAddress();
    fetchComments();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const submitComment = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const form = new FormData();
    form.append('text', commentText);
    form.append('rating', rating);
    images.forEach((uri, index) => {
      form.append('images', {
        uri,
        name: `image${index}.jpg`,
        type: 'image/jpeg'
      });
    });
    try {
      await axios.post(`http://localhost:3000/api/v1/comments/${addressId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setCommentText('');
      setRating('5');
      setImages([]);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  if (!address) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{address.title}</Text>
      <Text>{address.description}</Text>
      {address.photo && (
        <Image source={{ uri: `http://localhost:3000/api/v1/images/${address.photo}` }} style={styles.photo} />
      )}
      <Text style={styles.subtitle}>Comments:</Text>
      <FlatList
        data={comments}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text>{item.author.name} ({new Date(item.createdAt).toLocaleString()}): {item.text}</Text>
            {item.images.map(imgId => (
              <Image key={imgId} source={{ uri: `http://localhost:3000/api/v1/images/${imgId}` }} style={styles.commentImage} />
            ))}
          </View>
        )}
      />
      <Text style={styles.subtitle}>Add Comment:</Text>
      <TextInput placeholder="Comment" value={commentText} onChangeText={setCommentText} style={styles.input} />
      <TextInput placeholder="Rating (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />
      <Button title="Pick Image" onPress={pickImage} />
      {images.map(uri => (
        <Image key={uri} source={{ uri }} style={styles.commentImage} />
      ))}
      <Button title="Submit Comment" onPress={submitComment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { marginTop: 16, fontWeight: 'bold' },
  photo: { width: '100%', height: 200, marginVertical: 8 },
  comment: { borderTopWidth: 1, borderColor: '#ccc', paddingVertical: 8 },
  commentImage: { width: 100, height: 100, margin: 4 },
  input: { borderWidth: 1, marginBottom: 8, padding: 8 }
});
