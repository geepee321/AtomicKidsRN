import React, { useState } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Button, TextInput, Title, Text } from 'react-native-paper'
import { useAuth } from '../../context/auth'
import { Link, router } from 'expo-router'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()

  const handleLogin = async () => {
    try {
      setError(null)
      setLoading(true)
      await signIn(email, password)
      router.replace('/(app)')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.emojiContainer}>
          <Title style={styles.bigEmoji}>⚛️</Title>
        </View>
        <Title style={styles.title}>Welcome to Atomic Kids</Title>
      </View>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Login
      </Button>

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <Link href="/auth/signup" style={styles.link}>Sign up</Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: '20%',
  },
  emojiContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  bigEmoji: {
    fontSize: 80,
    lineHeight: 100,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: '#6750A4',
    height: 56,
  },
  buttonContent: {
    height: 56,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    color: '#6750A4',
  },
}) 