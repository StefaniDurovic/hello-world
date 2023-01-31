# Hello World - a chat app

  

## Description

A chat app built using React Native, Expo and Google Firebase. The app provides users with a user interface and options to share their location, take photos and share images. 

  

## Key Features

*  A page where users can enter their name and choose a background color for the chat screen before joining the chat.

*  A page displaying the conversation, as well as an input field and submit button.

* The chat provides users with three additional communication features: taking photos, sending images and location data.

* Data gets stored online and offline.

* Anonymous authentication via Google Firebase.


## Built with

* React Native
* Expo
* React Native asyncStorage API
* Google Firebase
* Gifted Chat

## Set up the Environment

### Prerequisites

 * Install  [Expo](https://expo.io/):  `npm install expo-cli`
 * Download [Expo Go App](https://expo.dev/client)  on your mobile device from Google Play Store or Apple Store.
 * Install device emulators: [Android Studio](https://developer.android.com/studio) for Windows and Linux users, [Xcode](https://developer.apple.com/xcode/) for Mac users.

### Getting started

* Install all dependencies by running  `npm i`
* Start the app by running `expo start`
* On the Expo Go App, launch the app by scanning the QR code provided in your terminal
* On an emulator, launch the app by clicking "Run on Android device / emulator"

### Setting up the database 

- Log in to [Firebase](https://firebase.google.com/) ( Firebase documentation can be found  [here](https://firebase.google.com/docs/web/setup) )
-   In your  [Firebase Console](https://console.firebase.google.com/), create a project in test mode.
-   In your terminal, run  `npm install firebase@8.10.1` inside your project's root directory.
-   At the top of your Chat.js file, require Firebase:
```javascript
> const  firebase = require('firebase');
> require('firebase/firestore');
```
-   Back in the Firebase Console, navigate to Project Settings and select the  `</>`  icon to register your application.
-   Copy the contents of the `config` object and store it in a variable inside the `constructor` of your Chat.js component:
```javascript
> const firebaseConfig = {
>  apiKey: 'your-api-key',
>  authDomain: 'your-authdomain',
>  databaseURL: 'your-database-url',
>  projectId: 'your-project-id',
>  storageBucket: 'your-storage-bucket',
>  messagingSenderId: 'your-messaging-sender-id',
>  appId: 'your-app-id',
> };
```
-   Stil inside the `constructor` of your Chat component, initialize the app and create a reference to ChatMessages collection in Firestore:

> if (!firebase.apps.length) {
>        firebase.initializeApp(firebaseConfig);
>    }

> const referenceChatMessages = firebase.firestore().collection('messages');

-   Enjoy the App!
