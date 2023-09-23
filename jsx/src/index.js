/** @jsx objectBuilder */

const objectBuilder = (nodeName, attributes, ...args) => {
  let children = args.length ? [].concat(...args) : null;
  return { nodeName, attributes, children };
};

const render = (vnode) => {
  if (!vnode) return;
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // create the dom element
  const domElement = document.createElement(vnode.nodeName);

  // copy the attributes
  const attributes = vnode.attributes || {};
  Object.keys(attributes).forEach((key) =>
    domElement.setAttribute(key, attributes[key])
  );

  // will iterate over children and append them to the dom element recursively
  vnode?.children?.forEach((child) => domElement.appendChild(render(child)));

  return domElement;
};

// Colocando tudo junto
const list = (items) => items.map((p) => <li> {p} </li>);

const vdom = (
  <div id="vdom-parent">
    <p>jsx rocks!</p>
    <ul>{list("lucas muniz dutra".split(" "))}</ul>
  </div>
);

const dom = render(vdom);

document.body.appendChild(dom);

const json = JSON.stringify(vdom, null, " ");

document.body.appendChild(render(<pre>{json}</pre>));
