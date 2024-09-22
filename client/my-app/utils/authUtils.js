import jwtDecode from "jwt-decode";
import * as SecureStore from "expo-secure-store";

export const getUserIdFromToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token"); 

    if (token) {
      const decoded = jwtDecode(token);
      return decoded._id;
    } else {
      console.error("No token found");
      return null;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};