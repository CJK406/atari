/* eslint-disable */

import VersionInfo from 'react-native-version-info';
import appNavigation from './AppNavigation';
import atariLogs from './AtariLogs';

class AppUtils {
  isAppUpdateRequired(appUpdate) {
    if (appUpdate?.app_version_code > VersionInfo.buildVersion) {
      return true;
    } else {
      return false;
    }
  }

  isForceUpdate(appUpdate) {
    return appUpdate?.force_update;
  }

  checkAppUpdate(props) {
    let appUpdate = props?.app_config_data?.message?.app_update;

    if (this.isAppUpdateRequired(appUpdate)) {
      if (this.isForceUpdate(appUpdate)) {
        appNavigation.replace(props.navigation, 'UpdateVersion', {
          data: appUpdate,
        });
      } else {
        appNavigation.navigate(props.navigation, 'UpdateVersion', {
          data: appUpdate,
        });
      }
    }
  }
}

const appUtils = new AppUtils();

export default appUtils;
