import {StyleSheet} from 'react-native';
import {FontFamilyMedium} from '../../Utils/AppContants';

export default StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: FontFamilyMedium,
  },
  row: {
    flexDirection: 'row',
    borderRadius: 100,
  },
  inputField: {
    width: '38%',
    height: 50,
    // backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'white',
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    paddingLeft: 10,
  },
  textField: {
    width: '38%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 4,
    paddingTop: 15,
  },
  iconContainer: {
    width: '12%',
    // backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 1,
    borderColor: 'white',
    height: 50,
  },
  centerIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
});
