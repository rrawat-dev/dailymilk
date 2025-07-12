import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
      <Tabs
        screenOptions={{
          headerStyle: {backgroundColor: '#f5f5f5'},
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            borderTopWidth: 0,
            shadowOpacity: 0
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#666666'
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Customers List',
            tabBarIcon: ({size, color}) => <FontAwesome name="users" size={size} color={color} />
          }}
        />
        <Tabs.Screen
          name="addCustomer"
          options={{
            title: 'Add Customer',
            tabBarIcon: ({size, color}) => <FontAwesome name="user-plus" size={size} color={color} />
          }}
        />
      </Tabs>
  );
}
