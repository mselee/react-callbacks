import * as React from 'react';
import isEqual from 'lodash-es/isEqual';

export interface Callback {
  args: any[];
  to: PropertyKey;
  fn: Function;
  context: this;
}

export type Injection = { [key: string]: Function };


export interface CallbacksProps {
  callbacks: Callback[];
  onInject?: (injectedProps: Injection) => void;
}

export interface CallbacksState {
  injection: Injection;
  callbacks: Callback[];
}

const proxy = (c: Callback) => (...args: any[]) => c.fn.apply(c.context, [...c.args, ...args]);

const inject = (props: CallbacksProps) => {
  const injection = props.callbacks.reduce((acc: any, c) => {
    acc[c.to] = proxy(c);
    return acc;
  }, {});
  if (props.onInject) props.onInject(injection);
  return injection;
}

export default class Callbacks extends React.Component<CallbacksProps, CallbacksState> {
  state = { injection: {}, callbacks: [] } as CallbacksState;

  static getDerivedStateFromProps(nextProps: CallbacksProps, prevState: CallbacksState) {
    if (!isEqual(nextProps.callbacks, prevState.callbacks)) {
      return { injection: inject(nextProps), callbacks: [...nextProps.callbacks] };
    }
    return null;
  }

  shouldComponentUpdate(nextProps: Readonly<CallbacksProps>, nextState: Readonly<{}>) {
    return !isEqual(this.props.callbacks, nextProps.callbacks);
  }

  render() {
    const children = this.props.children;

    if (!children) return null;

    return React.Children.map(
      children,
      child => child !== null && React.cloneElement(child as React.ReactElement<any>, this.state.injection)
    );
  }
}
