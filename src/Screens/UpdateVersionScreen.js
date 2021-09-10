import {Button} from 'native-base';
import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Header} from '../Components';
import {Images} from '../Assets';
import LinearGradient from 'react-native-linear-gradient';
import appUtils from '../Utils/AppUtils';

const {height} = Dimensions.get('window');

const UpdateVersionScreen = (props) => {
  const goBack = () => {
    const {navigation} = props;
    navigation.goBack();
  };
  const {data} = props.route;
  const {params} = props.route;
  return (
    <View style={{flex: 1}}>
      <Image
        resizeMode="contain"
        style={{
          resizeMode: 'cover',
          position: 'absolute',
          top: 0,
          bottom: 0,
          flex: 1,
          alignSelf: 'stretch',
          width: '100%',
          height: height,
        }}
        source={Images.dashboard_background}
      />

      <Header darkmode={true} />
      <View style={styles.container}>
        <Text style={styles.title}>{params?.data?.message}</Text>
        <View style={styles.btnContainer}>
          <LinearGradient
            colors={['#fff', '#000']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={{
              ...styles.inputContainer2,
              height: 43,
              borderWidth: 0,
              paddingLeft: 2,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.inputContainer2,
                {
                  backgroundColor: 'black',
                  justifyContent: 'center',
                  marginTop: 0,
                },
              ]}>
              <Text style={{fontWeight: '500', fontSize: 18, color: 'white'}}>
                Update
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <View style={{marginTop: 20}}>
            {appUtils.isForceUpdate(params?.data) ? null : (
              <TouchableOpacity
                onPress={() => goBack()}
                style={styles.btnCancel}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    // flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    color: 'white',
    marginBottom: 15,
  },
  btnCancel: {
    // backgroundColor: 'white',
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderRadius: 20,
  },
  btnUpdate: {
    backgroundColor: 'green',
    // width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    borderRadius: 500,
  },
  btnCancelText: {
    fontSize: 18,
    lineHeight: 22,
    color: 'white',
  },
  inputContainer2: {
    marginTop: 30,
    width: '100%',
    opacity: 1,
    borderRadius: 500,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UpdateVersionScreen;
