// See https://bugzilla.mozilla.org/show_bug.cgi?id=664398
//
// In Firefox this:
//      var d = document.createElement("div");
//      d.innerHTML ='<a href="~"></a>';
//      d.innerHTML;
// will result in:
//      <a href="%7E"></a>
// which is wrong

import lang from "wysihtml5/lang";

var TILDE_ESCAPED = "%7E";
var getCorrectInnerHTML = function(element) {
  var innerHTML = element.innerHTML;
  if (innerHTML.indexOf(TILDE_ESCAPED) === -1) {
    return innerHTML;
  }

  var elementsWithTilde = element.querySelectorAll("[href*='~'], [src*='~']");

  for (var index = 0, length = elementsWithTilde.length; index < length; index++) {
    var url = elementsWithTilde[index].href || elementsWithTilde[index].src;
    var urlToSearch = url.replace(/~/g, TILDE_ESCAPED);
    innerHTML = innerHTML.split(urlToSearch).join(url);
  }
  return innerHTML;
};

export { getCorrectInnerHTML };
