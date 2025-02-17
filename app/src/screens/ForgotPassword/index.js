import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

const ForgotPassword = ({ navigation }) => {
  const defaultEmail = 'nguyenvana270302@gmail.com';
  const [email, setEmail] = useState('');
  const [emailTextWidth, setEmailTextWidth] = useState(0);

  const goBack = () => {
    navigation.navigate('HomeScreen');
  };

  const verify = () => {
    if (email === defaultEmail) {
      navigation.navigate('VerifiedMail');
    } else {
      Alert.alert('This email does not match the email linked to your account');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.forgotpasswordTitle}>
        <Text style={styles.verifyEmail}>Please verify your email</Text>
        <Text
          style={styles.emailDefault}
          onLayout={(event) => setEmailTextWidth(event.nativeEvent.layout.width)}
        >
          nguyen******@gmail.com. We'll send you a 6-digit code to your email
        </Text>
      </View>

      <View style={[styles.emailInput, { width: emailTextWidth }]}>
        <TextInput
          style={styles.email}
          placeholder='Enter your email here'
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.sendButton} onPress={verify}>
          <Text style={styles.buttonTextConfirm}>Send</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={goBack}>
          <Text style={styles.buttonTextCancel}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    gap: 20,
    position: 'absolute',
    top: 100,
  },
  forgotpasswordTitle: {
    gap: 10,
    marginBottom: 30,
  },
  verifyEmail: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'left',
  },
  emailDefault: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
  },
  emailInput: {
    marginBottom: 40,
  },
  email: {
    backgroundColor: '#e0d6d5',
    borderWidth: 1,
    borderColor: '#a8a2a2',
    fontSize: 15,
    padding: 15,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 20,
    justifyContent: 'space-between',
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 18,
    borderRadius: 8,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#949188',
    padding: 12,
    borderRadius: 8,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextConfirm: {
    color: 'white',
    fontSize: 20,
  },
  buttonTextCancel: {
    color: 'black',
    fontSize: 20,
  },
});
