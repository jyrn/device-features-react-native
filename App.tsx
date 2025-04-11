import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext';
import { StyleSheet, View } from 'react-native';



const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const AddEntryStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false // Disable the stack header since we have a custom one in HomeScreen
      }}
    >
      <HomeStack.Screen 
        name="HomeMain" 
        component={HomeScreen}
      />
    </HomeStack.Navigator>
  );
}

function AddEntryStackScreen() {
  return (
    <AddEntryStack.Navigator>
      <AddEntryStack.Screen 
        name="AddEntryMain" 
        component={AddEntryScreen} 
        options={{ 
          title: 'Add Entry',
          headerShown: false 
        }} 
      />
    </AddEntryStack.Navigator>
  );
}

function MyTabs() {
  const { theme } = useTheme();


  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#343a40' : '#62b6cb',
          borderRadius: 45,  // Makes the bottom navigation bar rounder
          height: 80,        // Increase the height for a more rounded effect
          position: 'absolute',  // Ensure it's positioned at the bottom of the screen
          left: 0,           // Position at the far left
          right: 0,          // Position at the far right
          bottom: 20,        // Add space from the bottom
          marginHorizontal: '5%', // Add equal margin from both sides (centers the nav)
          shadowColor: theme === 'dark' ? '#000' : '#ccc',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          paddingBottom: 15,  // Adjust bottom padding (increase/decrease)
          paddingTop: 10,      // Adjust top padding if necessary
          borderTopWidth: 0,  // Remove the top border
          

        },
        tabBarActiveTintColor: theme === 'dark' ? '#fff' : '#fff',
        tabBarInactiveTintColor: theme === 'dark' ? '#dee2e6' : '#dee2e6',
        headerShown: false, // Hide headers at tab level
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="AddEntryTab"
        component={AddEntryStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={30} color={color} />
          ),
          tabBarLabel: 'Add',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { theme } = useTheme();

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer
          style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}
        >
          <MyTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 90,
  },
});
