import React, { Component } from 'react';
import { ScrollView, SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

// GoogleSignin.configure();

export default class LoginScreen extends Component{
    state = {
        isSigninInProgress: false,
        isLoginScreenPresented: true, //show login Screen if not sign in
        userInfo: {
          idToken: '',
          serverAuthCode: '',
          scopes: [], // on iOS this is empty array if no additional scopes are defined
          user: {
            email: '',
            id: '',
            givenName: '',
            familyName: '',
            photo: '', // url
            name: '' // full name
          }
        }
    }

    // componentDidMount() {
    //     GoogleSignin.configure({
    //       //It is mandatory to call this method before attempting to call signIn()
    //       scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    //       // Repleace with your webClientId generated from Firebase console
    //       webClientId:
    //         '192.168.56.101',
    //     });
    //   }
      _signIn = async () => {
        //Prompts a modal to let the user sign in into your application.
        try {
          await GoogleSignin.hasPlayServices({
            //Check if device has Google Play Services installed.
            //Always resolves to true on iOS.
            showPlayServicesUpdateDialog: true,
          });
          const userInfo = await GoogleSignin.signIn();
          console.log('User Info --> ', userInfo);
          this.setState({ 
            isLoginScreenPresented: false,
            userInfo: userInfo 
          });
        } catch (error) {
          console.log('Message', error.message);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User Cancelled the Login Flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing In');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services Not Available or Outdated');
          } else {
            console.log('Some Other Error Happened');
          }
        }
      };
      //May be called eg. in the componentDidMount of your main component. This method returns the current user and rejects with an error otherwise.
      getCurrentUserInfo = async () => {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          this.setState({ userInfo });
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            // user has not signed in yet
          } else {
            // some other error
          }
        }
      };
      //This method may be used to find out whether some user is currently signed in.
      // It returns a promise which resolves with a boolean value (it never rejects). In the native layer, this is a synchronous call
      isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        this.setState({ isLoginScreenPresented: !isSignedIn });
      };

      //Remove user session from the device.
      signOut = async () => {
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };

      //Remove your application from the user authorized applications.
      revokeAccess = async () => {
        try {
          await GoogleSignin.revokeAccess();
          console.log('deleted');
        } catch (error) {
          console.error(error);
        }
      };

    render() {
        return(
        <SafeAreaView style={ styles.container}> 
          <GoogleSigninButton
              style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center', width: 192, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this._signIn}
              disabled={this.state.isSigninInProgress} />
              
          
        </SafeAreaView> 
        );
      }
      
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
})