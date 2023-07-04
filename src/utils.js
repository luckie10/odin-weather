/**
 * Create an HTML element with any attribute
 *
 * @param {string} tagName - Name of HTML tag
 * @param {{name: string, value: string}} attributes - Object of attributes to be appened to HTML element
 * @returns {Element} HTML Element
 */
function createElement(tagName, attributes) {
  const element = document.createElement(tagName);

  if (attributes) {
    Object.entries(attributes).map(([name, value]) => {
      name === "textContent"
        ? (element.textContent = value)
        : element.setAttribute(name, value);
    });
  }

  return element;
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export { createElement, removeAllChildren };
