import {StyleSheet} from 'react-native';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
  SILVER_GREY,
} from '../../Utils/AppContants';

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
    color: COLOR_GREY,
    marginLeft: 10,
    fontSize: 20,
    fontFamily: FontFamilyRegular,
  },
  subTitle: {
    marginLeft: 10,
    fontSize: 10,
    color: SILVER_GREY,
    fontFamily: FontFamilyMedium,
  },
});
