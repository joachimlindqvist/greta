import React from 'react';
import PropTypes from 'prop-types';

export default function connect(Component) {

  return function(stateFn, actionFn) {

    stateFn = stateFn || function() { return {}; };
    actionFn = actionFn || function(actions) { return actions; };

    class ConnectedComponent extends React.Component {

      componentWillMount() {
        this.context.store.onChange((state) => {
          const stateProps = stateFn(state);
          let hasChanged = false;

          if (typeof this.previousStateProps === 'undefined') {
            hasChanged = true;
          }

          if (!hasChanged) {
            const statePropsKeys = Object.keys(stateProps).sort().join(',');
            const previousStatePropsKeys = Object.keys(this.previousStateProps).sort().join(',');
            hasChanged = statePropsKeys !== previousStatePropsKeys;
          }

          if (!hasChanged) {
            Object.keys(stateProps).forEach((key) => {
              const keyChanged = stateProps[key] !== this.previousStateProps[key];
              if (keyChanged) {
                hasChanged = keyChanged;
                return;
              }
            });
          }

          if (hasChanged) {
            // Re-render this component to pass the new state to Component
            this.setState({});
          }

          this.previousStateProps = stateProps;
        });
      }

      childProps() {
        const stateProps = stateFn(this.context.store.getState(), this.props);
        const actionProps = actionFn(this.context.store.actions, this.props);
        return { ...stateProps, actions: actionProps };
      }

      render() {
        return <Component {...this.childProps()} {...this.props} />;
      }
    };

    ConnectedComponent.contextTypes = {
      store: PropTypes.shape({}).isRequired,
    };

    ConnectedComponent.displayName = `ConnectedComponent(${Component.name})`;

    return ConnectedComponent;
  }
}