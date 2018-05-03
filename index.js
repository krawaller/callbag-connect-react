var React = require('react');
var forEach = require('callbag-for-each');

module.exports = function connect(opts){
  var sources = opts.sources || {};
  var signals = opts.signals || [];
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
