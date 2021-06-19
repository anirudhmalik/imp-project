/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   Platform,
   StyleSheet,
   Text,
   Button,
   View,
   Alert,
   ScrollView
 } from 'react-native';
 
 import nodejs from 'nodejs-mobile-react-native';
 
 export default class App extends Component{
   constructor(props){
     super(props);
     this.state = { lastNodeMessage: "No message yet." };
     this.listenerRef = null;
   }
   componentWillMount()
   {
     nodejs.start('main.js');
     this.listenerRef = ((msg) => {
       this.setState({lastNodeMessage: msg});
     });
     nodejs.channel.addListener(
       "message",
       this.listenerRef,
       this 
     );
   }
   componentWillUnmount()
   {
     if (this.listenerRef) {
       nodejs.channel.removeListener("message", this.listenerRef);
     }
   }
   render() {
     return (
       <ScrollView style={styles.container}>
         <Button title="Get Versions"
           onPress={() => nodejs.channel.send('versions')}
         />
         <Button title="Run sha3"
           onPress={() => nodejs.channel.send('run')}
         />
         <Text style={styles.instructions}>
           {this.state.lastNodeMessage}
         </Text>
       </ScrollView>
     );
   }
 }
 
 const styles = StyleSheet.create({
   container: {
     backgroundColor: '#F5FCFF',
   },
   welcome: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   instructions: {
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
   },
 });