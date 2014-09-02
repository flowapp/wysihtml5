var containsContent = function(node) {
  return node.textContent || node.querySelector("img");
}

export { containsContent };
