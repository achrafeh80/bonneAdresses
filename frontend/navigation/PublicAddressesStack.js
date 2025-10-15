import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PublicAddressesScreen from '../screens/PublicAddressesScreen';
import AddressDetailScreen from '../screens/AddressDetailScreen';

const Stack = createNativeStackNavigator();

export default function PublicAddressesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PublicAddresses" component={PublicAddressesScreen} options={{ title: 'Public Addresses' }} />
      <Stack.Screen name="AddressDetail" component={AddressDetailScreen} options={{ title: 'Address Detail' }} />
    </Stack.Navigator>
  );
}
