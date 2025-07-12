import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

export default function AuthScreen () {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const theme = useTheme();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be 6 character long.');
      return;
    }

    setError(null);

    if (isSignUp) {
      const error = await signUp(email, password);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const error = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
    }

  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {' '}
          { isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@example.com"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />
        {
          error && <Text style={{color: theme.colors.error}}>{error}</Text>
        }
        
        <Button mode="contained" style={styles.button} onPress={handleAuth}> 
          { isSignUp ? 'Sign Up' : 'Sign In' }
        </Button>
        <Button mode="text" onPress={handleSwitchMode} style={styles.button}>
          { isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up' }
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    marginBottom: 24
  },
  input: {
    marginBottom: 16
  },
  button: {
    marginTop: 8
  },
  switchModeButton: {
    marginTop: 16
  }
});