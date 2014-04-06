var contains = function(container, element) {
  if (element.nodeType !== Node.ELEMENT_NODE) {
    element = element.parentNode;
  }
  return container !== element && container.contains(element);
};

export { contains };
