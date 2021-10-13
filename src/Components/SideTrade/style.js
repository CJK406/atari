import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#ce2424',
    height: 48,
    marginTop: 10,
    // paddingTop: 5,
  },
  rightRadius: {
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    // paddingLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftRadius: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    alignItems: 'center',
    // paddingRight: 5,
    justifyContent: 'center',
  },
  labelStyle: {
    fontSize: 12,
    color: 'white',
  },
});
