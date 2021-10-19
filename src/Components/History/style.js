import {StyleSheet} from 'react-native';
import {TRANSPARENT_COLOR} from '../../Utils/AppContants';

export default StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    // paddingBottom: 75,
    // paddingRight: 30,
  },
  backGroundHistory: {
    backgroundColor: TRANSPARENT_COLOR,
    padding: 10,
    paddingTop: 15,
    borderRadius: 7,
  },
  backGroundHistoryWhite: {
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 15,
    borderRadius: 7,
  },
});
