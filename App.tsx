import React, { PureComponent } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import SodyoSdk from '@sodyo/react-native-sodyo-sdk'
import { overlay } from './overlay'

export default class App extends PureComponent {
  state = {
    isReady: false,
    initErr: null,
    sodyoErr: '',
    immediateData: '',
    scannerErr: '',
    currentMarkerId: '',
    currentMarkerData: null,
  }

  handleStart = async () => {
    try {
      const granted = Platform.OS === 'ios'
        ? PermissionsAndroid.RESULTS.GRANTED
        : await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return

      SodyoSdk.start(
        (immediateData) => {
          console.warn('SodyoSDK.start.immediate', immediateData)
          this.setState({ immediateData: immediateData })
        },
        (err) => {
          console.warn('SodyoSDK.start.err', JSON.stringify(err))
          this.setState({ scannerErr: err })
        })
    } catch (err) {
      console.warn(err.message)
    }
  }

  handleOpenLastMarker = () => {
    const { currentMarkerId } = this.state

    if (!currentMarkerId) {
      console.warn('has no currentMarkerId')
      return
    }

    SodyoSdk.performMarker(currentMarkerId)
  }

  handleCloseScanner = () => {
    console.warn('handleCloseSodyoScanner')
    SodyoSdk.close()
  }

  handlePressLeft = () => {
    console.warn('handlePressLeft')
    SodyoSdk.close()
  }

  handlePressRight = () => {
    console.warn('handlePressRight')
    SodyoSdk.close()
  }

  componentDidMount (): void {
    SodyoSdk.init(
      'API_KEY',
      () => {
        console.warn('SodyoSDK.init.success')
        this.setState({ isReady: true })

        SodyoSdk.setUserInfo({ userName: 'Donald' })
        SodyoSdk.setAppUserId('123')
        SodyoSdk.setCustomAdLabel('label1,label2,label3')
        SodyoSdk.setScannerParams({ Prob_Size: 8 })

        SodyoSdk.setOverlayView(overlay)
        SodyoSdk.setOverlayCallback('handleCloseSodyoScanner', this.handleCloseScanner)
        SodyoSdk.setOverlayCallback('handlePressLeft', this.handlePressLeft)
        SodyoSdk.setOverlayCallback('handlePressRight', this.handlePressRight)
      },
      (err) => {
        console.warn('SodyoSDK.init.err', JSON.stringify(err))
        this.setState({ initErr: err })
      },
    )

    SodyoSdk.onError(
      (err) => {
        console.warn('onError', JSON.stringify(err))
        this.setState({ sodyoErr: err })
      },
    )

    SodyoSdk.onMarkerContent((markerId, data) => {
      console.warn('onMarkerContent', markerId)
      this.setState({ currentMarkerId: markerId, currentMarkerData: data })
    })
  }

  componentWillUnmount (): void {
    SodyoSdk.removeAllListeners()
  }

  render () {
    const { isReady, initErr, sodyoErr, immediateData, scannerErr, currentMarkerId, currentMarkerData } = this.state
    return (
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior='automatic'>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Hello, SodyoSDK</Text>
            <Text style={styles.sectionDescription}>isReady: {isReady.toString()}</Text>
            <Text style={styles.sectionDescription}>initErr: {initErr}</Text>
            <Text style={styles.sectionDescription}>sodyoErr: {sodyoErr}</Text>
            <Text style={styles.sectionDescription}>immediateData: {immediateData}</Text>
            <Text style={styles.sectionDescription}>scannerErr: {scannerErr}</Text>
            <Text style={styles.sectionDescription}>currentMarkerId: {currentMarkerId}</Text>
            <Text style={styles.sectionDescription}>currentMarkerData: {JSON.stringify(currentMarkerData)}</Text>
          </View>

          <Button onPress={this.handleStart} title='Open scanner' />
          <Button onPress={this.handleOpenLastMarker} title='Open last marker' />

        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 32,
    paddingHorizontal: 24,
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
})

