/* eslint-disable */

class AppNavigation {
  navigate = (navigation, route, data) => {
    navigation.navigate(route, data);
  };

  replace = (navigation, route, data) => {
    navigation.replace(route, data);
  };
}

const appNavigation = new AppNavigation();

export default appNavigation;
