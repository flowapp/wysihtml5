/**
 * document.execCommand("foreColor") will create either inline styles (firefox, chrome) or use font tags
 * which we don't want
 * Instead we set a css class
 */
import { quirks } from "../quirks";
import lang from "wysihtml5/lang";
import dom from "../dom";
import { formatInline } from "./formatInline";

var REG_EXP = /(\s|^)background-color\s*:\s*[^;\s]+;?/gi;

var bgColorStyle = {
  exec: function(composer, command, color) {
    var colorVals  = quirks.styleParser.parseColor((typeof(color) == "object") ? "background-color:" + color.color : "background-color:" + color, "background-color"),
        colString;
    
    if (colorVals) {
      colString = "background-color: rgb(" + colorVals[0] + ',' + colorVals[1] + ',' + colorVals[2] + ');';
      if (colorVals[3] !== 1) {
        colString += "background-color: rgba(" + colorVals[0] + ',' + colorVals[1] + ',' + colorVals[2] + ',' + colorVals[3] + ');';
      }
      formatInline.exec(composer, command, "span", false, false, colString, REG_EXP);
    }
  },
  
  state: function(composer, command) {
    return formatInline.state(composer, command, "span", false, false, "background-color", REG_EXP);
  },
  
  stateValue: function(composer, command, props) {
    var st = this.state(composer, command),
        colorStr, 
        val = false;
        
    if (st && lang.object(st).isArray()) {
      st = st[0];
    }
    
    if (st) {
      colorStr = st.getAttribute('style');
      if (colorStr) {
        if (colorStr) {
          val = quirks.styleParser.parseColor(colorStr, "background-color");
          return quirks.styleParser.unparseColor(val, props);
        }
      }
    }
    return false;
  }
};

export { bgColorStyle };