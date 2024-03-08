import { StyleSheet, View, Text, ImageBackground, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { SIZES } from '../constants/themes';

const { height } = Dimensions.get('window');

const WelcomeScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <View style={{
            paddingTop: 40
        }}>
            <ImageBackground style={{
               height: height / 1.5,
            }} source={require('../assets/appLogo.jpg')}/>
        </View>

        <View style={{
            paddingHorizontal: 15 * 2,
            paddingTop: 40,
            paddingBottom: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
 
            <Button 
                title='Get started'
                onPress={() => navigation.navigate('PhoneNumber')}
            /> 
            
        </View>

</SafeAreaView>
)}

export default WelcomeScreen;

const styles = StyleSheet.create({
    welcomeScreen: {
        backgroundColor: 'white',
        height: SIZES.height
    }
});