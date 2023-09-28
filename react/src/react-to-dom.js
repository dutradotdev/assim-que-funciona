// using react
const reactElement = <h1 title="foo">Hello</h1>;
const reactContainer = document.getElementById("root");
ReactDOM.render(reactElement, reactContainer);

// the same code using plain js
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
};

const container = document.getElementById("root");

const node = document.createElement(element.type);
node.title = element.props.title;

const text = document.createTextNode("");
text.nodeValue = element.props.children;

node.appendChild(text);
container.appendChild(node);
