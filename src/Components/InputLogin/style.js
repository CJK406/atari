/* eslint-disable */
import {StyleSheet, Dimensions} from 'react-native';
import {FontFamilyMedium} from '../../Utils/AppContants';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    width: width * 0.64,
    opacity: 1,
    borderRadius: 500,
    // borderColor: 'white',
    borderWidth: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    width: width * 0.7,
    height: 50,
    color: 'white',
    fontFamily: FontFamilyMedium,
    paddingLeft: 25,
    paddingRight: 25,
  },

  container2: {
    marginTop: 30,
    width: width * 0.7,
    opacity: 1,
    borderRadius: 500,
    borderWidth: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
