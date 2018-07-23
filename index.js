import * as React from 'react';
import forEach from 'callbag-for-each';

export default function connect(...args){
  let sources = {}, signals = [];
  args.forEach(a => {
    if (Array.isArray(a)) signals = signals.concat(a);
    else if (typeof a === 'object') sources = Object.assign(sources,a);
    else throw new Error('Unknown argument passed to connect! ' + a);
  });
  return function(Comp){
    class SourceWrapper extends React.Component {
      constructor(props){
        super(props);
        this.state = {};
        this.comp = React.createRef();
      }
      componentDidMount(){
        Object.keys(sources).forEach(name => {
          forEach(d => this.setState({[name]: d}))(sources[name]);
        });
        signals.forEach(([source, callback]) => forEach(d => callback(this.comp.current, d))(source));
      }
      render() {
        return React.createElement(Comp, Object.assign(
          {ref: this.comp},
          this.props,
          this.state
        ));
      }
    }
    return SourceWrapper;
  }
};
