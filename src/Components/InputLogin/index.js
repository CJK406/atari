/* eslint-disable */

import React from 'react';
import {View, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import styles from './style';
import {
  COLOR_GREY,
  FontFamilyMedium,
  SILVER_GREY,
} from '../../Utils/AppContants';

class InputLogin extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          this.props.mode ? styles.container2 : styles.container,

          this.props.darkmode
            ? {borderColor: COLOR_GREY}
            : {borderColor: SILVER_GREY},
        ]}>
        <View style={{width: '10%'}} />
        <View style={{width: '90%'}}>
          <TextInput
            ref={this.props.inputReff}
            style={[styles.input, {fontFamily: FontFamilyMedium}]}
            placeholderTextColor={COLOR_GREY}
            {...this.props}
          />
        </View>
      </View>
    );
  }
}

InputLogin.propTypes = {
  mode: PropTypes.number,
  inputRef: PropTypes.func,
};

InputLogin.defaultProps = {
  mode: 0, //0 login; 1: register
  inputReff: () => {},
};

export default InputLogin;
