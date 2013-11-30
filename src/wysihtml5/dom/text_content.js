var documentElement = document.documentElement;
var setTextContent, getTextContent;
if ("textContent" in documentElement) {
  setTextContent = function(element, text) {
    element.textContent = text;
  };

  getTextContent = function(element) {
    return element.textContent;
  };
} else if ("innerText" in documentElement) {
  setTextContent = function(element, text) {
    element.innerText = text;
  };

  getTextContent = function(element) {
    return element.innerText;
  };
} else {
  setTextContent = function(element, text) {
    element.nodeValue = text;
  };

  getTextContent = function(element) {
    return element.nodeValue;
  };
}

export {setTextContent, getTextContent}

