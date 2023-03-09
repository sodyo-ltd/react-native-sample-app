import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid, Platform,
  TouchableOpacity,
  Linking,
} from "react-native";

import SodyoSdk, { Scanner } from '@sodyo/react-native-sodyo-sdk'
import { WebView } from 'react-native-webview'


const SODYO_APP_KEY = 'aee837645d2145e7a699fbeb38b5d184'
const SODYO_ENV = 'DEV'

const App = () => {
  const webViewRef = useRef()
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [status, setStatus] = useState('')

  const handleOpenScanner = useCallback(() => {
    setIsScannerOpen(true)

    console.log(webViewRef.current)

    if (!webViewRef.current) {
      return
    }

    webViewRef.current.injectJavaScript(
      `window.postMessage(
      {
        openScanner: true,
        sender: 'SDK',
      }
    );`
    )
  }, [])

  const handleCloseScanner = useCallback(() => {
    setIsScannerOpen(false)
  }, [])

  const onMessage = useCallback((event) => {
    const data = event.nativeEvent.data

    if (!data) {
      return
    }

    const parsedData = JSON.parse(data)

    if (!parsedData) {
      return
    }

    if (parsedData.sender === 'SODYO_SDK') {

      if (parsedData.status) {
        setStatus(`SDK status: ${parsedData.status}`)
      }

      if (parsedData.closeScanner) {
        setIsScannerOpen(false)
        webViewRef.current.injectJavaScript(
          `window.postMessage(
          {
            closeScanner: true,
            sender: 'SDK',
          }
        );`
        )
      }
    }

  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: '#039be5',
            borderRadius: 8,
          }}
          onPress={handleOpenScanner}
        >
          <Text style={{ fontWeight: 'bold' }} >
            Open scanner
          </Text>
        </TouchableOpacity>
        <Text style={{ marginVertical: 20 }}>
          {status}
        </Text>
      </View>
      <View style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: isScannerOpen ? 'flex' : 'none',
      }}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'http://localhost:1234' }}
          onMessage={onMessage}
        />
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  btn: {
    marginVertical: 10,
  },
});

export default App;
