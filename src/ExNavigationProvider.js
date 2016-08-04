/**
 * @flow
 */

import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import storeShape from 'react-redux/lib/utils/storeShape';

import Actions from './ExNavigationActions';
import { createBackButtonManager } from './ExNavigationBackButtonManager';
import ExNavigationContext from './ExNavigationContext';
import { ExNavigationRouter } from './ExNavigationRouter';

type Props = {
  router: ExNavigationRouter<*>,
  context?: ExNavigationContext,
  children: React.Element<{}>,
};

type State = {};

export default class ExNavigationProvider extends React.Component {
  props: Props;
  state: State;

  _navigationContext: ExNavigationContext;

  static childContextTypes = {
    navigationStore: storeShape.isRequired,
    navigation: PropTypes.instanceOf(ExNavigationContext),
  };

  getChildContext(): Object {
    return {
      navigationStore: this._navigationContext.store,
      navigation: this._navigationContext,
    };
  }

  constructor(props: Props) {
    super(props);

    if (!props.context && !props.router) {
      throw new Error('If no custom NavigationContext is passed into NavigationProvider, you must provide a router.');
    }

    if (!props.context) {
      this._navigationContext = new ExNavigationContext({
        router: props.router,
      });
    } else {
      this._navigationContext = props.context;
    }

    createBackButtonManager(this._navigationContext.store);
  }

  componentWillMount() {
    this._navigationContext.dispatch(Actions.initialize());
  }

  render(): ReactElement<any> {
    return (
      <View style={styles.container}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
