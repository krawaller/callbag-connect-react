# callbag-connect-react

A utility for connecting a React component with [Callbag](https://github.com/callbag/callbag) sources. Comparable to [ReactRedux](https://github.com/reactjs/react-redux), but for Callbags instead of Redux!

`npm install callbag-connect-react`

## usage

```
import connect from 'callbag-connect-react

@connect(
  { // Objects are assumed to contain sourcess
    propName: source1,
    ...
  },
  [ // Arrays are assumed to contain signals
    [source2, callback],
    ...
  ]
})
class MyComponent extends React {
  ...
}
```

Now;

* Whenever `source1` emits data, that will be sent to the `propName` prop in `MyComponent`.
* Whenever `source2` emits, `callback` will be invoked with `(componentInstance, emission)`.


### Sources

An object where the keys are prop names and values are sources. When a source emits, the corresponding prop will be populated.

### Signals

An array of tuples, each tuple is an array with a source and a callback. Whenever the source emits, the callback will be called with the component instance and the emitted data.

Use signals when you want your component to do something *other* than render when a source emits.
