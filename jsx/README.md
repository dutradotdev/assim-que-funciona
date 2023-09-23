# O que é JSX?

JSX é um syntax sugar para escrever componentes. Por baixo dos panos, o código é transpilado para JS puro.

JSX:

```jsx
const teste = <div id="teste">oi</div>;
```

Transpilado:

```js
const teste = objectBuilder("div", { id: teste }, "oi");
```

## objectBuilder()? De onde saiu essa função?

O `objectBuilder()`` é injetado pelo transpilador. No início do arquivo, colocamos:

```js
/** @jsx objectBuilder */
```

Assim, toda vez que o transpilador encontrar um jsx, ele "transformará" o código JSX nessa função `objectBuilder()``.
Poderia ser também:

```js
/** @jsx bundalele */
/** @jsx banana */
/** @jsx whatever */
```

## Sobre o objectBuilder()

Basicamente, ela recebe três argumentos (ou mais, depende de args) e retorna um outro objeto.
O 3 argumento em diante será um children.

Declaração:

```js
const objectBuilder = (nodeName, attributes, ...args) => {
  let children = args.length ? [].concat(...args) : null;
  return { nodeName, attributes, children };
};
```

Chamada:

```js
objectBuilder("div", { class: "teste" }, "eae");
```

Retorno:

```json
{
  "nodeName": "div",
  "attributes": {
    "class": "teste"
  },
  "children": ["eae"]
}
```

## E para que serve esse JSON?

O JSON é passado para uma função `render`, que é mais ou menos assim:

```js
const render = (vnode) => {
  if (!vnode) return;
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // cria o elemento do dom de acordo com o nodeName do node (nosso json)
  const domElement = document.createElement(vnode.nodeName);

  // copia todos os atributos (class, id, etc etc etc)
  const attributes = vnode.attributes || {};
  Object.keys(attributes).forEach((key) =>
    domElement.setAttribute(key, attributes[key])
  );

  // itera sobre os childs e adiciona eles ao elemento dom recursivamente
  vnode?.children?.forEach((child) => domElement.appendChild(render(child)));

  return domElement;
};
```

A função `render` recebe um node em formato JSON e devolve um elemento do DOM.

## Usando tudo que aprendemos

Para ver todo este processo acontecendo, basta executar `npm run babel` na raiz do projeto.
Será gerada um arquivo na pasta `dist/bundle.js`

Código passado:

```js
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
```

Código transpilado:

```js
var list = function list(items) {
  return items.map(function (p) {
    return objectBuilder("li", null, " ", p, " ");
  });
};
var vdom = objectBuilder(
  "div",
  {
    id: "vdom-parent",
  },
  objectBuilder("p", null, "jsx rocks!"),
  objectBuilder("ul", null, list("lucas muniz dutra".split(" ")))
);

var dom = render(vdom);
document.body.appendChild(dom);
var json = JSON.stringify(vdom, null, " ");
document.body.appendChild(render(objectBuilder("pre", null, json)));
```

o JSON gerado pelo código acima fica assim:

```json
{
  "nodeName": "div",
  "attributes": {
    "id": "vdom-parent"
  },
  "children": [
    {
      "nodeName": "p",
      "attributes": null,
      "children": ["jsx rocks!"]
    },
    {
      "nodeName": "ul",
      "attributes": null,
      "children": [
        {
          "nodeName": "li",
          "attributes": null,
          "children": [" ", "lucas", " "]
        },
        {
          "nodeName": "li",
          "attributes": null,
          "children": [" ", "muniz", " "]
        },
        {
          "nodeName": "li",
          "attributes": null,
          "children": [" ", "dutra", " "]
        }
      ]
    }
  ]
}
```

## Referências

https://jasonformat.com/wtf-is-jsx/#Transpilation
