
import VersionInfo from 'react-native-version-info'

let isAppUpdateRequire = true;
class AppUtils {
 
 
  isAppUpdateRequied = (appConfig) => {
    if (30 > VersionInfo.buildVersion){
     return true
    }
    return false
  }
}

const appUtils = new AppUtils()

export default appUtils