var Constants = {
  INVISIBLE_SPACE: "\uFEFF",
  BACKSPACE_KEY: 8,
  ENTER_KEY: 13,
  ESCAPE_KEY: 27,
  SPACE_KEY: 32,
  DELETE_KEY: 46,

  URL_REG_EXP: /^((https?:\/\/|www\.|mailto:)[^\s<]{3,})/gi,
  URL_REG_EXP_NON_START: /((https?:\/\/|www\.|mailto:)[^\s<]{3,})/gi,

  BLOCK_ELEMENTS: ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "DIV", "BLOCKQUOTE"]

};

export { Constants };
