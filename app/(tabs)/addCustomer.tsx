import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";

export default function AddCustomerScreen() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const [name, setName] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>();
  const [errorMsg, setErrorMsg] = useState<string | null>();

  const theme = useTheme();

  const handleSubmit = async () => {
    if (!name) {
      setNameError("Please enter customer name.");
    } else {
      setNameError(null);
    }

    if (!mobile) {
      setMobileError("Please enter customer mobile number.");
    } else {
      setMobileError(null);
    }

    try {
      await drizzleDb.insert(schema.customers).values({
        name: name,
        mobile: mobile,
        photo: null
      });

      setSuccessMsg("Customer added successfully.");
      setName(null);
      setMobile(null);
    } catch (error:any) {
      setErrorMsg(error.message)
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        {
          errorMsg && (
            <>
              <Text>{errorMsg}</Text>
            </>
          )
        }
        {
          successMsg && (
            <>
              <Text>Customer added successfully.</Text>
            </>
          )
        }
        {
          !successMsg && (
            <>
              <TextInput
                label="Customer Name"
                autoCapitalize="none"
                style={styles.input}
                onChangeText={setName}
              />
              {nameError && (
                <Text style={{ color: theme.colors.error }}>{nameError}</Text>
              )}
              <TextInput
                label="Customer Mobile Number"
                autoCapitalize="none"
                keyboardType="email-address"
                mode="outlined"
                secureTextEntry
                style={styles.input}
                onChangeText={setMobile}
              />
              {mobileError && (
                <Text style={{ color: theme.colors.error }}>{mobileError}</Text>
              )}

              <Button mode="contained" style={styles.button} onPress={handleSubmit}>
                Add Customer
              </Button>
            </>
          )
        }
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
