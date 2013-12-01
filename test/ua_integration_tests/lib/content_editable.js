function ContentEditableDiv() {
  var element = document.createElement("div");
  element.setAttribute("contenteditable", "true");
  Excecute("autoUrlDetect", false, false);
  Excecute("styleWithCSS", false, false);
  Excecute("enableObjectResizing", false, false);
  Excecute("insertBrOnReturn", false, false);
  document.body.appendChild(element);
  return element;
}

function Excecute(command, opposite, value) {
  try {
    document.execCommand(command, opposite, value);
  } catch(e) {

  }
}

export { ContentEditableDiv };