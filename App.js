import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  PermissionsAndroid, Platform,
} from "react-native";

import SodyoSdk, { Scanner } from '@sodyo/react-native-sodyo-sdk'


const SODYO_APP_KEY = 'aee837645d2145e7a699fbeb38b5d184'
const SODYO_ENV = 'dev'

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isScannedEnabled, setIsScannerEnabled] = useState(true)
  const [error, setError] = useState('')
  const [immediateData, setImmediateData] = useState('')
  const [scannerError, setScannerError] = useState('')
  const [currentMarkerId, setCurrentMarkerId] = useState('')
  const [currentMarkerData, setCurrentMarkerData] = useState(null)

  const [isTroubleshootEnabled, setIsTroubleshootEnabled] = useState(false)

  useEffect(() => {
    SodyoSdk.init(
      SODYO_APP_KEY,
      async () => {
        SodyoSdk.setEnv(SODYO_ENV)
        SodyoSdk.setSodyoLogoVisible(false)
        SodyoSdk.addScannerParam('LoadingIndicator', 'true')

        SodyoSdk.setAppUserId('sodyo-sample-test-user')
        SodyoSdk.setUserInfo({
          firstName: 'Sodyo Sample',
          lastName: 'Test User'
        })

        setIsInitialized(true)
        setError('')
      },
      (e) => {
        setIsInitialized(true)
        setError(e)
      },
    )

    SodyoSdk.onError(
      (err) => {
        setError(err)
      },
    )

    SodyoSdk.onModeChange((data) => {
      if (!data) {
        return
      }

      if (data.newMode === 'Troubleshoot') {
        setIsTroubleshootEnabled(true)
      }

      if (data.newMode === 'Normal') {
        setIsTroubleshootEnabled(false)
      }
    })

    SodyoSdk.onMarkerContent((markerId, data) => {
      setCurrentMarkerId(markerId)
      setCurrentMarkerData(data)
    })

    return () => {
      // SodyoSdk.removeAllListeners()
    }

  }, [])

  const handleOpenLastMarker = () => {
    if (!currentMarkerId) {
      alert('No current marker ID')
      return
    }

    SodyoSdk.performMarker(currentMarkerId)
  }

  const handleToggleEnabled = () => {
    setIsScannerEnabled(val => !val)
  }

  const handleToggleTroubleShoot = () => {
    if (isTroubleshootEnabled) {
      SodyoSdk.setNormalMode()
    } else {
      SodyoSdk.setTroubleshootMode()
    }
  }

  if (!isInitialized) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size='large' color='#d3d3d3' />
        </View>
      </SafeAreaView>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Scanner
          isEnabled={isScannedEnabled}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SodyoSDK</Text>
            <Text style={styles.sectionDescription}>Is initialized: {isInitialized.toString()}</Text>
            <Text style={styles.sectionDescription}>Is enabled: {isScannedEnabled.toString()}</Text>
            <Text style={styles.sectionDescription}>Error: {error}</Text>
            <Text style={styles.sectionDescription}>Immediate data: {immediateData}</Text>
            <Text style={styles.sectionDescription}>Scanner error: {scannerError}</Text>
            <Text style={styles.sectionDescription}>Current marker ID: {currentMarkerId}</Text>
            <Text style={styles.sectionDescription}>Current marker data: {JSON.stringify(currentMarkerData)}</Text>
          </View>

          <View style={styles.btn}>
            <Button onPress={handleToggleEnabled} title='Start/Pause scanner' />
          </View>

          <View style={styles.btn}>
            <Button onPress={handleToggleTroubleShoot} title='Start/Pause troubleshoot' />
          </View>

          <View style={styles.btn}>
            <Button onPress={handleOpenLastMarker} title='Open last marker' />
          </View>
        </Scanner>
      </View>
    </SafeAreaView>
  );
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
