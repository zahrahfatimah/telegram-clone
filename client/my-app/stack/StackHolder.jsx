import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // Import stack navigator

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ChatScreen from "../screens/ChatScreen";
import PostsScreen from "../screens/HomeScreen"; 

import { AuthContext } from "../context/AuthContext";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PostsScreen" 
        component={PostsScreen} 
        options={{ title: "All chats" }}
      />
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
        options={{ title: "Chat Details" }} 
      />
    </Stack.Navigator>
  );
};

const StackHolder = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {isLoggedIn ? (
          <>
            <Tab.Screen name="Home" component={AuthenticatedStack} />
          </>
        ) : (
          <>
            {/* <Tab.Screen name="Register" component={RegisterScreen} /> */}
            <Tab.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default StackHolder;
