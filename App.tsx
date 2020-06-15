import React, { PureComponent } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native'
import SodyoSdk, { Scanner } from '@sodyo/react-native-sodyo-sdk'

interface IState {
  isInit: boolean,
  initErr: any,
  sodyoErr: string,
  immediateData: string,
  scannerErr: string,
  currentMarkerId: string,
  currentMarkerData: any,
  scannerFragmentIsEnabled: boolean,
}

export default class App extends PureComponent<{}, IState> {
  state = {
    isInit: false,
    initErr: null,
    sodyoErr: '',
    immediateData: '',
    scannerErr: '',
    currentMarkerId: '',
    currentMarkerData: null,
    isStarted: false,
    scannerFragmentIsEnabled: true,
  }

  handleToggleScanner = () => {
    this.setState({ scannerFragmentIsEnabled: !this.state.scannerFragmentIsEnabled })
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
          this.setState({ immediateData })
        },
        (err) => {
          console.warn('SodyoSDK.start.err', JSON.stringify(err))
          this.setState({ scannerErr: err })
        })
    } catch (err) {
      this.setState({ scannerFragmentIsEnabled: true })
      console.warn(err.message)
    }
  }

  handleCloseScanner = () => SodyoSdk.close()

  handleOpenLastMarker = () => {
    const { currentMarkerId } = this.state

    if (!currentMarkerId) {
      console.warn('has no currentMarkerId')
      return
    }

    SodyoSdk.performMarker(currentMarkerId)
  }

  componentDidMount (): void {
    SodyoSdk.init(
      '!!!API_KEY!!!',
      () => {
        console.warn('SodyoSDK.init.success')

        SodyoSdk.setUserInfo({ userName: 'Donald' })
        SodyoSdk.setAppUserId('123')
        SodyoSdk.setCustomAdLabel('label1,label2,label3')

        this.setState({ isInit: true })
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
      isInit,
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
        {isInit ? (
          <Scanner isEnabled={scannerFragmentIsEnabled}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hello, SodyoSDK</Text>
              <Text style={styles.sectionDescription}>isInit: {isInit.toString()}</Text>
              <Text style={styles.sectionDescription}>initErr: {initErr}</Text>
              <Text style={styles.sectionDescription}>sodyoErr: {sodyoErr}</Text>
              <Text style={styles.sectionDescription}>immediateData: {immediateData}</Text>
              <Text style={styles.sectionDescription}>scannerErr: {scannerErr}</Text>
              <Text style={styles.sectionDescription}>currentMarkerId: {currentMarkerId}</Text>
              <Text style={styles.sectionDescription}>currentMarkerData: {JSON.stringify(currentMarkerData)}</Text>
            </View>

            <View style={styles.btn}>
              <Button
                onPress={this.handleOpenScanner}
                title={`Open scanner as new ${Platform.OS === 'ios' ? 'view controller' : 'intent'} `}
              />
            </View>

            <View style={styles.btn}>
              <Button onPress={this.handleToggleScanner} title='Pause/Continue scanner' />
            </View>

            <View style={styles.btn}>
              <Button onPress={this.handleOpenLastMarker} title='Open last marker' />
            </View>
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
  btn: {
    marginVertical: 10,
  },
})

