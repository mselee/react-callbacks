import * as React from 'react';
import { shallow, mount } from 'enzyme';
import Callbacks, { CallbacksProps, Injection } from '../src/react-callbacks';

interface State {
  counter: number;
  injectedProps: Injection;
}

class DebugCallbacks extends React.Component<CallbacksProps, State> {
  state = { counter: 0, injectedProps: {} } as State;

  handleInject = (injectedProps: {}) => {
    this.setState(({ counter }) => ({ counter: counter + 1, injectedProps }));
  }

  render() {
    return <Callbacks {...this.props} onInject={this.handleInject} />
  }
}

const onClick = (id: any, event: React.MouseEvent<HTMLElement>) => {
  event.currentTarget.setAttribute('data-id', `${id}`);
}

it('does no injection when there are no children', () => {
  const callback = mount(<DebugCallbacks callbacks={[]} />);
  expect(callback.state('counter')).toBe(0);
});

it('doesnt generate functions when callbacks is empty', () => {
  const callback = mount(<DebugCallbacks callbacks={[]}><button /></DebugCallbacks>);
  expect(callback.state('counter')).toBe(0);
});

it('doesnt generate the functions on every render/update needlessly', () => {
  const callbacksProps = { context: this, fn: onClick, args: [1], to: 'onClick' };
  const callback = mount(
    <DebugCallbacks callbacks={[callbacksProps]}>
      <button />
    </DebugCallbacks>
  );

  expect(callback.state('counter')).toBe(1);

  for (let i = 0; i < 10; i++) {
    callback.update();
  }

  expect(callback.state('counter')).toBe(1);
});

it('re-generates the functions a passed argument changes', () => {
  const callbacksProps = { context: this, fn: onClick, args: [1], to: 'onClick' };
  const callback = mount(
    <DebugCallbacks callbacks={[callbacksProps]}>
      <button />
    </DebugCallbacks>
  );

  expect(callback.state('counter')).toBe(1);

  callback.setProps({ callbacks: [{ ...callbacksProps, args: [22] }] })

  expect(callback.state('counter')).toBe(2);
});

it('the passed callback matches the generated function', () => {
  const props = { context: this, fn: onClick, args: [1], to: 'onClick' };
  const callback = mount(
    <DebugCallbacks callbacks={[props]}>
      <button />
    </DebugCallbacks>
  );

  const injection = callback.state('injectedProps') as Injection;
  expect(injection).toHaveProperty(props.to);
  expect(injection[props.to].name).toBe('');
  expect(injection[props.to].arguments).toBe(null);
});

it('the passed callback actually works', () => {
  const callbacksProps = { context: this, fn: onClick, args: [1], to: 'onClick' };
  const callback = mount(
    <DebugCallbacks callbacks={[callbacksProps]}>
      <button />
    </DebugCallbacks>
  );

  callback.find('button').simulate('click');
  expect(callback.find('button').getDOMNode().getAttribute('data-id')).toBe("1");
});