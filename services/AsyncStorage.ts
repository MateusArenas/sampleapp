import NativeAsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorage {

  static async setItem(key: string, value: any) {
    try {
      if (value === undefined || value === null) {
        await NativeAsyncStorage.removeItem(key);
      } else {
        await NativeAsyncStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch (err) {
      throw err;
      return false;
    }
  }
  

  static async getItem (key: string) {
    try {
      const stringify = await NativeAsyncStorage.getItem(key);
      return stringify ? JSON.parse(stringify) : null;
    } catch(err) {
      throw err;
      return false;
    }
  }

  static async removeItem (key: string) {
    try {
      await NativeAsyncStorage.removeItem(key);
      return true;
    } catch(err) {
      throw err;
      return false;
    }
  };
  
  static async clear () {
    try {
      await NativeAsyncStorage.clear();
      return true;
    } catch(err) {
      throw err;
      return false;
    }
  };
  
}