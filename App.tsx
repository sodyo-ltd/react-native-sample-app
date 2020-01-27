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
  ActivityIndicator,
} from 'react-native'
import SodyoSdk, { Scanner } from '@sodyo/react-native-sodyo-sdk'
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
    scannerFragmentIsEnabled: true,
  }

  handleOpenScanner = async () => {
    try {
      const granted = Platform.OS === 'ios'
        ? PermissionsAndroid.RESULTS.GRANTED
        : await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return
      }

      this.setState({ scannerFragmentIsEnabled: false })

      SodyoSdk.start(
        (immediateData) => {
          console.warn('SodyoSDK.start.immediate', immediateData)
          this.setState({ immediateData: immediateData })
        },
        (err) => {
          console.warn('SodyoSDK.start.err', JSON.stringify(err))
          this.setState({ scannerErr: err, scannerFragmentIsEnabled: true })
        })
    } catch (err) {
      this.setState({ scannerFragmentIsEnabled: true })
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
    this.setState({ scannerFragmentIsEnabled: true })
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
      '!!!API_KEY!!!',
      () => {
        console.warn('SodyoSDK.init.success')
        this.setState({ isReady: true })

        SodyoSdk.setUserInfo({ userName: 'Donald' })
        SodyoSdk.setAppUserId('123')
        SodyoSdk.setCustomAdLabel('label1,label2,label3')

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
    const {
      isReady,
      initErr,
      sodyoErr,
      immediateData,
      scannerErr,
      currentMarkerId,
      currentMarkerData,
      scannerFragmentIsEnabled,
    } = this.state

    return (
      <SafeAreaView>
        {isReady ? (
          <Scanner isEnabled={scannerFragmentIsEnabled}>
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

            <Button
              onPress={this.handleOpenScanner}
              title={`Open scanner as new ${Platform.OS === 'ios' ? 'view controller' : 'intent'} `}
            />
            <Button onPress={this.handleOpenLastMarker} title='Open last marker' />
          </Scanner>
        ) : <ActivityIndicator size='large' />}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 32,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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

