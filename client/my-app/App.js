import { LoginProvider } from "./context/AuthContext";
import StackHolder from "./stack/StackHolder";
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";

if(__DEV__){
  loadDevMessages()
  loadErrorMessages()
}
export default function App() {
  return (
    // ?? Instead of using both in here, we will separate via Component
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Login" component={LoginPage} />
    //     <Stack.Screen name="Home" component={HomePage} />
    //     <Stack.Screen name="ColorAdd" component={ColorAddPage} />
    //   </Stack.Navigator>
    // </NavigationContainer>

    // ?? We will inject the ApolloProvider
    <ApolloProvider client={client}>
      {/* // ?? We will inject the Provider for do login here */}
      <LoginProvider>
        <StackHolder />
      </LoginProvider>
    </ApolloProvider>
  );
}