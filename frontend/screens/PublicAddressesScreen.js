import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export default function PublicAddressesScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    const auth = getAuth();
    const token = await auth.currentUser.getIdToken();
    const res = await axios.get('http://localhost:3000/api/v1/addresses/public', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAddresses(res.data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAddresses);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={addresses}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8 }}>
            <Text>{item.title} by {item.owner.name}</Text>
            <Button title="View" onPress={() => navigation.navigate('AddressDetail', { addressId: item._id })} />
          </View>
        )}
      />
    </View>
  );
}
