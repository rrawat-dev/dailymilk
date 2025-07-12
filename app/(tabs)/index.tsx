import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';

export default function Index() {
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const [customerList, setCustomerList] = useState([]);
  const fetchCustomers = async () => {
    try {
      const result = await drizzleDb.select().from(schema.customers);
      const list = {};

      result.forEach(item => {
        const keyChar = item.name.charAt(0).toUpperCase();
        const keyArr = list[keyChar] || [];
        keyArr.push(item);
        list[keyChar] = keyArr;
      });
      const sectionList = Object.keys(list).map(keyChar => ({
        title: keyChar,
        data: list[keyChar]
      }));

      setCustomerList(sectionList);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleProfileClick = () => {
    router.push('/calendar');
  };

  return (
    <View
      style={styles.view}
    >
      {<SectionList
        sections={customerList}
        renderSectionHeader={({section}) => (
          <Text>{section.title}</Text>
        )}
        renderItem={({item}) => <Button onPress={handleProfileClick}>{item.name}</Button>}
        keyExtractor={item => `basicListEntry-${item.id}`}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    width: 100,
    height: 20,
    backgroundColor: 'coral',
    borderRadius: 8,
    textAlign: 'center'
  }
})
