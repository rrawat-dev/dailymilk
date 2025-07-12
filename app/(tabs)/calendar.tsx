import * as schema from "@/db/schema";
import { and, eq } from 'drizzle-orm';
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, RadioButton, SegmentedButtons } from "react-native-paper";

const App = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [calendarData, setCalendarData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDateLabel, setCurrentDateLabel] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null)

  useEffect(() => {
    let counter = 0;
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const newCalendarData = ([...new Array(42)]).map((item, index) => {
      let date = null;

      if (index >= firstDayOfMonth && counter < lastDayOfMonth) {
        counter = counter + 1;
        date = counter;
      } else {
        date = null;
      }

      return { id: index, title: date ? (date < 10 ? `0${date}`: date) : '' };
    });

    setCurrentDateLabel(
      `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    );

    setCalendarData([
      ...[
        {id: 'sun', title: 'S'},
        {id: 'mon', title: 'M'},
        {id: 'tue', title: 'T'},
        {id: 'wed', title: 'W'},
        {id: 'thu', title: 'T'},
        {id: 'fri', title: 'F'},
        {id: 'sat', title: 'S'}
      ],
      ...newCalendarData
    ]);

  }, [currentDate]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  }

  const handleDeliveredButtonClick = async () => {
    
    try {
      console.log('>>>> @@@00');
      const customers = await drizzleDb.select()
        .from(schema.calendar)
        .where(
          and(
            eq(schema.calendar.customerId, '9871321358'),
            eq(schema.calendar.year, currentDate.getFullYear()),
            eq(schema.calendar.month, months[currentDate.getMonth()])
          )
        );

      console.log('>>>> @@@', customers.length);
      
      if (customers.length > 0) {
        await drizzleDb.insert(schema.customers).values({
          customerId: '9871321358',
          year: currentDate.getFullYear(),
          month: months[currentDate.getMonth()],
          [`day${selectedDate}`]: deliveryStatus
        });
      } else {
        await drizzleDb.update(schema.calendar)
          .set({ [`day${selectedDate}`]: deliveryStatus })
          .where(
          and(
            eq(schema.calendar.customerId, '9871321358'),
            eq(schema.calendar.year, currentDate.getFullYear()),
            eq(schema.calendar.month, months[currentDate.getMonth()])
          )
        );
      }

      

      const newCalendarData = calendarData.map(item => {
        
        if (item.title === selectedDate) {
          return { ...item, deliveryStatus}
        }

        return item;
      });

      setCalendarData(newCalendarData);
      setDeliveryStatus(null);
      setModalVisible(false)
      
    } catch (error) {
      console.log('>>>>>', error.message);
    }
  }

  const handleDateNav = (value) => {
    if (value === 'prev') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() -1, 1));
    } else if (value === 'next') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {

    }
  };

  const renderGridItem = ({ item }) => (
    <View style={styles.gridItem}>
      <Button
        style={styles.itemText}
        mode={item.deliveryStatus === 'Y' ? 'contained': 'text'}
        onPress={() => handleDateClick(item.title)}
      >
        {item.title}
      </Button>
    </View>
  );

  const containerStyle = {backgroundColor: 'white', padding: 20};

  return (
    <View>
      <SegmentedButtons
        value={''}
        onValueChange={handleDateNav}
        buttons={[
          {
            value: 'prev',
            label: '< Prev',
          },
          {
            value: 'change',
            label: currentDateLabel,
          },
          { value: 'next', label: 'Next >' },
        ]}
      />

      { calendarData &&
        <FlatList
          data={calendarData}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={7} // Set the number of columns here
          contentContainerStyle={styles.gridContainer}
        />
      }

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={containerStyle}>
          <RadioButton.Group onValueChange={value => setDeliveryStatus(value)} value={deliveryStatus}>
            <RadioButton.Item label="Item delivered" value="Y" />
            <RadioButton.Item label="Item not delivered" value="N" />
          </RadioButton.Group>

          <Button onPress={handleDeliveredButtonClick}>Save</Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: 10,
  },
  gridItem: {
    flex: 1,
    margin: 5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    height: 50, // Example fixed height
  },
  itemText: {
    fontSize: 16,
  },
});

export default App;
