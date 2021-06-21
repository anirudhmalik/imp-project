import AsyncStorage from '@react-native-community/async-storage';
class Storage {
    constructor(){
        this._asyncStorage = AsyncStorage;
    }

    _storeData = async (key,value) => {
        try{
            await this._asyncStorage.setItem(key,JSON.stringify(value));
        }catch(error){
            //log this error
            console.log(error)
        }
    }

    _readData = async (key) => {
        try{
           let data = await this._asyncStorage.getItem(key);
           if(data==null){
               return false;
           }
           let result =JSON.parse(data);
           return result;
        }catch(error){
            //log the error
        }
    }

    _deleteData = async (key) => {
        try{
            await this._asyncStorage.removeItem(key);
        }catch(error){
            //log the error
        }
        
    }
}

export default Storage;
