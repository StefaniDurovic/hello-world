import React from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from 'react-native';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: ''        
      },
    };

    const firebaseConfig = {
      apiKey: "AIzaSyDCt1svozlRAkWSDgU38xmGESu8RHIqZKs",
      authDomain: "chat-app-caf26.firebaseapp.com",
      projectId: "chat-app-caf26",
      storageBucket: "chat-app-caf26.appspot.com",
      messagingSenderId: "338678982602",
      appId: "1:338678982602:web:750b5ec35b6674dd615133",
      measurementId: "G-3TENPQWHYX"
    }

    // Firebase initialization
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
      }

    // reference to 'messages' collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }


 
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // sets static messages
    this.setState({
      messages: [
        // {
        //   _id: 1,
        //   text: "Hello developer",
        //   createdAt: new Date(),
        //   user: {
        //     _id: 2,
        //     name: "React Native",
        //     avatar: "https://placeimg.com/140/140/any",
        //   },
        // },
        {
            _id: 2,
            text: 'Welcome to your chatroom!',
            createdAt: new Date(),
            system: true,
           },
      ],
    });

    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

    // Firebase anonymous authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });

  }

  componentWillUnmount() {
    // stops listening for changes in messages
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    () => {
      this.addMessage();
    }
    );
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
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
      });
    });
    // set new state of messages (with the added one)
    this.setState({
      messages,
    });
  };


  // changes text bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#ebb765'
          },
          right: {
            backgroundColor: '#d8c6a9'
          }
        }}
      />
    )
  }

  render() {
    let color = this.props.route.params.color;
    return (
      <View style={{flex: 1, backgroundColor: color}}>
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: this.state.uid,
              avatar: 'https://placeimg.com/140/140/any',
            }}
          />
          {/* bug fix for older Android versions */}
          { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null } 
      </View>
    );
  }
}
