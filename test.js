const React = require('react');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const makeMock = require('callbag-mock');
const test = require('tape');
const { JSDOM } = require('jsdom');
const connect = require('.');

Enzyme.configure({ adapter: new Adapter() });

test('it connects source to props', t => {

  // cannot test new props with wrapper.props() because of Enzyme bug
  // https://github.com/airbnb/enzyme/issues/1229

  setupDOM();
  const source = makeMock(true);
  let testValue;

  @connect({test: source})
  class Wrapped extends React.Component {
    componentDidUpdate(){
      testValue = this.props.test;
    }
    render(){ return <span>Output doesn't matter</span>; }
  }

  const wrapper = Enzyme.mount(<Wrapped/>);

  source.emit(1, 'data');

  setTimeout(()=>{
    t.deepEqual(testValue, 'data', 'got data when source emitted');
    t.end();
  });

});

test('it passes along other props', t => {
  setupDOM();

  const source = makeMock(true);

  @connect({})
  class Wrapped extends React.Component {
    render(){ return <span>Output doesn't matter</span>; }
  }

  const wrapper = Enzyme.mount(<Wrapped foo='bar' />);

  t.equal(wrapper.props().foo, 'bar', 'connect passed other props along');
  t.end();
});

test('it acts on signals correctly', t => {
  setupDOM();

  const source = makeMock(true);

  t.plan(1);

  @connect({}, [ [source, (me,data) => me.receive(data)] ])
  class Wrapped extends React.Component {
    receive(data){
      t.equal(data, 'data', 'Emission was correctly passed in');
    }
    render(){ return <span>Output doesn't matter</span>; }
  }

  const wrapper = Enzyme.mount(<Wrapped/>);
  source.emit(1, 'data');

  setTimeout(t.end);
});

test('it works to pass signals as first arg', t => {
  setupDOM();

  const source = makeMock(true);

  t.plan(1);

  @connect([ [source, (me,data) => me.receive(data)] ])
  class Wrapped extends React.Component {
    receive(data){
      t.equal(data, 'data', 'Emission was correctly passed in');
    }
    render(){ return <span>Output doesn't matter</span>; }
  }

  const wrapper = Enzyme.mount(<Wrapped/>);
  source.emit(1, 'data');

  setTimeout(t.end);
});

// Helper function from Enzyme guide
// https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md
function setupDOM(){
  const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
  const { window } = jsdom;

  function copyProps(src, target) {
    const props = Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .reduce((result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop),
      }), {});
    Object.defineProperties(target, props);
  }

  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);
}
