import React, {useContext, useRef, useState} from 'react'
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import colors from '../../../resources/colors'
import strings from '../../../resources/strings'
import dimens from '../../../resources/dimens'
import {isIOS} from '../../../resources/oss'
import logo from '../../../resources/images/launcher_icon.jpeg'
import {Context} from '../../../context'
import {login} from './repository'
import Toast from 'react-native-root-toast'
import InputField from '../../../base/views/inputField'
import PositiveButton from '../../../base/views/positiveButton'

const LoginScreen = ({navigation}) => {
  const passwordRef = useRef(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {setLoading} = useContext(Context)
  const {setIsLoggedIn} = useContext(Context)
  return (
    <KeyboardAvoidingView enabled={isIOS()} behavior="position">
      <ScrollView style={styles.root}>
        <Image style={styles.logo} source={logo} />
        <View style={styles.form}>
          <InputField
            placeholder={strings.login.username}
            onSubmitEditing={() => passwordRef.current.focus()}
            setValueState={setUsername}
          />
          <InputField
            placeholder={strings.login.password}
            secureTextEntry={true}
            returnKeyType={'done'}
            reference={passwordRef}
            setValueState={setPassword}
          />
          <PositiveButton
            title={strings.login.login}
            onPress={() => {
              setLoading(true)
              login(username, password)
                .then(data => {
                  setLoading(false)
                  setIsLoggedIn(true)
                })
                .catch(e => {
                  setLoading(false)
                  Toast.show(`${e}`)
                })
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: {
    height: dimens.matchParent,
    backgroundColor: colors.white,
  },
  logo: {
    width: dimens.matchParent,
    height: 250,
  },
  form: {
    marginTop: 16,
    marginBottom: 200,
    padding: 8,
  },
})

export default LoginScreen
