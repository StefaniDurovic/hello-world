import React from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
    };

    const firebaseConfig = {
      apiKey: "AIzaSyDCt1svozlRAkWSDgU38xmGESu8RHIqZKs",
      authDomain: "chat-app-caf26.firebaseapp.com",
      projectId: "chat-app-caf26",
      storageBucket: "chat-app-caf26.appspot.com",
      messagingSenderId: "338678982602",
      appId: "1:338678982602:web:750b5ec35b6674dd615133",
      measurementId: "G-3TENPQWHYX",
    };

    // Firebase initialization
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // reference to 'messages' collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // get messages from asyncStorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // retrieves messages from asyncStorage
    this.getMessages();

    // check if user is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("online");

        this.setState({
          isConnected: true,
        });

        // Firebase authorization
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            // update state with currently active user's data
            this.setState({
              messages: [],
              user: {
                _id: user.uid,
                name,
                avatar,
              },
            });
          });
        this.unsubscribe = this.referenceChatMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);
      } else {
        console.log("offline");
        // get messages from asyncStorage if user is offline
        this.getMessages();
        this.setState({ isConnected: false });
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      // stops listening for changes in messages
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  // save messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });
    // set new state of messages (with the added one)
    this.setState({
      messages,
    });
    // Sync fetched messages with asyncStorage (local)
    this.saveMessages();
  };

  // changes text bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#ebb765",
          },
          right: {
            backgroundColor: "#d8c6a9",
          },
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  render() {
    let color = this.props.route.params.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: "https://placeimg.com/140/140/any",
          }}
        />
        {/* bug fix for older Android versions */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
