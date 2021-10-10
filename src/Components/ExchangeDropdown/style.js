import {StyleSheet} from 'react-native';
import {
  COLOR_GREY,
  FontFamilyMedium,
  FontFamilyRegular,
  SILVER_GREY,
} from '../../Utils/AppContants';

export default StyleSheet.create({
  container: {
    position: 'relative',
  },
  label: {
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 13,
    marginTop: 7,
    color: COLOR_GREY,
    fontFamily: FontFamilyMedium,
    marginLeft: 7,
  },
  selectBox: {
    width: '100%',
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 13,
    paddingRight: 20,
    borderWidth: 0.8,
    borderColor: COLOR_GREY,
    // backgroundColor: 'white',
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 20,
    alignItems: 'center',
  },

  selectedBox: {
    width: '100%',
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 13,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  activeLabel: {
    width: '65%',
    // alignSelf: 'center',
    color: 'white',
    fontFamily: FontFamilyMedium,
  },
  activeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: FontFamilyMedium,
  },

  activeTitleOpen: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: FontFamilyMedium,
  },
  carretIcon: {
    marginTop: 13,
    marginRight: 15,
    textAlign: 'right',
  },
  dropdownLabelContainer: {
    width: '80%',
    alignSelf: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    width: '100%',
    top: 100,
    zIndex: 999999,
  },
});
