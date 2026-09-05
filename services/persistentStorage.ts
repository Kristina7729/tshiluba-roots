import AsyncStorage, { createAsyncStorage } from "@react-native-async-storage/async-storage";

/**
 * Storage instance created explicitly via createAsyncStorage, with fallback to default AsyncStorage.
 */
const customStorage = typeof createAsyncStorage === "function" ? createAsyncStorage("tshiluba_roots_db") : AsyncStorage;

/**
 * Robust async storage wrapper that handles v3 createAsyncStorage and legacy AsyncStorage API calls.
 */
export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (customStorage && typeof customStorage.getItem === "function") {
        const val = await customStorage.getItem(key);
        if (val !== null && val !== undefined) {
          return val;
        }
      }
    } catch (e) {
      console.warn("[safeStorage] customStorage.getItem error, trying legacy:", e);
    }

    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === "function") {
        return await AsyncStorage.getItem(key);
      }
    } catch (e) {
      console.warn("[safeStorage] AsyncStorage.getItem error:", e);
    }

    return null;
  },

  async setItem(key: string, value: string): Promise<void> {
    let success = false;
    let lastError: any = null;

    try {
      if (customStorage && typeof customStorage.setItem === "function") {
        await customStorage.setItem(key, value);
        success = true;
      }
    } catch (e) {
      lastError = e;
      console.warn("[safeStorage] customStorage.setItem error, trying legacy:", e);
    }

    if (!success) {
      try {
        if (AsyncStorage && typeof AsyncStorage.setItem === "function") {
          await AsyncStorage.setItem(key, value);
          success = true;
        }
      } catch (e) {
        lastError = e;
        console.warn("[safeStorage] AsyncStorage.setItem error:", e);
      }
    }

    if (!success) {
      throw lastError || new Error("Failed to write to storage");
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (customStorage && typeof customStorage.removeItem === "function") {
        await customStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("[safeStorage] customStorage.removeItem error:", e);
    }

    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === "function") {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn("[safeStorage] AsyncStorage.removeItem error:", e);
    }
  },
};

export default safeStorage;
