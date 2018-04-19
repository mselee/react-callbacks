# React Callbacks

A React HOC that generates and injects parameterized callbacks to its children, avoiding the need for creating anonymous functions inside the render method.

### Installation

```bash
yarn add react-callbacks
```

### Usage

```javascript
import * as React from 'react';
import Callbacks from 'react-callbacks';

const onClick = (id, event) => {
  console.log(`Button of value ${id} was clicked!`);
}

class Page extends React.Component {
  render() {
    return (
      <div>
      {
        [1,2,3,4,5].map(value => (
          <Callbacks
            key={value}
            callbacks={[{ context: this, fn: onClick, args: [value], to: 'onClick' }]}
          >
            <button />
          </Callbacks>
        ))
      }
      </div>
    );
  }
}
```

### API
| Prop          | Type          | Required      | Description
| ------------- | ------------- | ------------- | -------------
| callbacks     | Callback[]    | Required      | a list of callbacks to pass to the underlying children
| onInject      | Function      | Optional      | a method that accepts injected props of type `Injection` as an argument

#### Callback
| Prop          | Description
| ------------- | ------------- 
| context       | the execution context of the callback
| fn            | the callback function you want to pass
| args          | the list of arguments that will be applied to the passed function
| to            | the name of the property that this callback should be passed to

#### Injection
An object whose keys are the names of the callback props (e.g. onClick, onKeyPress, ...) and the value is the generated function attached to the respective event handler.
Note: the generated function's arguments are the original passed arguments along with the original event.
