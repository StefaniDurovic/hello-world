import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createStackNavigator();


export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}











// import React, { Component } from 'react';
// import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';

// export default class App extends React.Component {
//  constructor(props) {
//    super(props);
//    this.state = { text: '' };
//  }

//  // alert the user input
//  alertMyText (input = []) {
//   Alert.alert(input.text);
// }

//  render() {
//    return (
//      <View style={{ flex: 1, justifyContent: "center" }}>
//        <TextInput
//          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
//          onChangeText={(text) => this.setState({ text })}
//          value={this.state.text}
//          placeholder="Type here ..."
//        />
//        <Text>You wrote: {this.state.text}</Text>
//        <Button
//          onPress={() => { this.alertMyText({ text: this.state.text }); }}
//          title="Press Me"
//        />
//      </View>
//    );
//  }
// }
