import {StyleSheet} from 'react-native';
import {FontFamilyMedium, FontFamilyRegular} from '../../Utils/AppContants';

export default StyleSheet.create({
  container: {
    // backgroundColor: 'rgb(66,66,66)',
    marginBottom: 15,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  childBox: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: 'white',
    marginLeft: 10,
    fontSize: 20,
    fontFamily: FontFamilyMedium,
  },
  subTitle: {
    marginLeft: 10,
    fontSize: 10,
    color: '#a7a7a7',
    fontFamily: FontFamilyMedium,
  },
});
