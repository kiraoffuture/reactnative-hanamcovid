import React, {useEffect, useState} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {LogBox, View} from 'react-native'
import {Context} from '@app/context'
import MainNavigator from './app/screens/main/mainNavigator'
import AuthNavigator from './app/screens/auth/authNavigator'
// @ts-ignore
import Spinner from 'react-native-loading-spinner-overlay'
import {REQUEST_TIMEOUT} from '@configs/api'
import {getIsLoggedIn} from '@screens/auth/login/repository'
import messaging from '@react-native-firebase/messaging'
import Toast from 'react-native-root-toast'

LogBox.ignoreLogs([
  'RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks',
])

//todo re-config firebase crashlytics

const App = () => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!loading) {
      return
    }
    setTimeout(() => {
      setLoading(false)
    }, REQUEST_TIMEOUT)
  }, [loading])

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    getIsLoggedIn()
      .then(isLogged => {
        setIsLoggedIn(isLogged)
      })
      .catch(() => {
        setIsLoggedIn(false)
      })
    messaging()
      .getToken()
      .then(result => {
        console.log('token = ' + JSON.stringify(result))
      })
      .catch(e => {
        console.log(e)
      })
    messaging()
      .subscribeToTopic('news')
      .then(() => console.log('Subscribed to topic!'))
    return messaging().onMessage(async remoteMessage => {
      console.log(JSON.stringify(remoteMessage))
      Toast.show(
        `A new FCM message arrived!', ${JSON.stringify(remoteMessage)}`,
      )
    })
  }, [])

  if (isLoggedIn === null) {
    return null
  }

  return (
    <Context.Provider
      value={{
        setLoading,
        setIsLoggedIn,
      }}>
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      {loading ? (
        <View>
          <Spinner visible={loading} />
        </View>
      ) : null}
    </Context.Provider>
  )
}

export default App
