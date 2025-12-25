export default function highlighter(code: string): string {
  const jsKeywords = [
    "const", "let", "var", "function", "return", "if", "else", "switch", "case", "break",
    "for", "while", "do", "try", "catch", "finally", "throw", "new", "delete", "typeof",
    "instanceof", "await", "async", "yield", "import", "from", "export", "default",
    "class", "extends", "super", "this", "true", "false", "null", "undefined",
    "NaN", "Infinity", "useState", "useEffect", "useRef", "useContext", "useMemo",
    "useCallback", "useReducer", "useLayoutEffect", "React", "Fragment", "props", "children",
    "Math", "document", "window", "map", "filter", "reduce", "forEach", "find", "includes", "push", "pop", "shift", "unshift",
    "slice", "splice", "replace", "split", "join", "concat", "indexOf", "toLowerCase", "toUpperCase",
    "trim", "length", "charAt", "substring", "typeof", "instanceof", "parseInt", "parseFloat",
    "isNaN", "isFinite", "Object", "Array", "String", "Number", "Boolean", "JSON", "console",
    "log", "error", "warn", "alert", "setTimeout", "setInterval", "clearTimeout", "clearInterval",
    "addEventListener", "removeEventListener", "querySelector", "getElementById",
  ];

  const csharpKeywords = [
    "abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked",
    "class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else",
    "enum", "event", "explicit", "extern", "false", "finally", "fixed", "float", "for",
    "foreach", "goto", "if", "implicit", "in", "int", "interface", "internal", "is", "lock",
    "long", "namespace", "new", "null", "object", "operator", "out", "override", "params",
    "private", "protected", "public", "readonly", "ref", "return", "sbyte", "sealed", "short",
    "sizeof", "stackalloc", "static", "string", "struct", "switch", "this", "throw", "true",
    "try", "typeof", "uint", "ulong", "unchecked", "unsafe", "ushort", "using", "virtual",
    "void", "volatile", "while",

    // contextual keywords
    "add", "alias", "async", "await", "dynamic", "get", "global", "partial", "remove",
    "set", "value", "var", "when", "where", "yield",

    // C# common types (System)
    "List", "Dictionary", "HashSet", "Tuple", "Task", "DateTime", "Guid",

    // Unity types (Vector3 요청 + 관련 타입들)
    "Vector2", "Vector3", "Vector4",
    "Quaternion",
    "Transform",
    "GameObject",
    "MonoBehaviour",
    "Texture2D",
    "Material",
    "Shader",
    "Color",
    "Matrix4x4",
    "Rigidbody",
    "Collider",
    "Bounds",
  ];

  const pythonKeywords = [
    "False", "None", "True", "and", "as", "assert", "async", "await", "break", "class",
    "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global",
    "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return",
    "try", "while", "with", "yield"
  ];

  const openglKeywords = [
    // core functions
    "glBindBuffer", "glBufferData", "glBufferSubData", "glGenBuffers", "glDeleteBuffers",
    "glBindVertexArray", "glGenVertexArrays", "glDeleteVertexArrays",
    "glEnableVertexAttribArray", "glVertexAttribPointer",
    "glCreateShader", "glShaderSource", "glCompileShader", "glGetShaderiv",
    "glCreateProgram", "glAttachShader", "glLinkProgram", "glUseProgram",
    "glGetProgramiv", "glGetUniformLocation", "glUniform1i", "glUniform1f",
    "glUniform2f", "glUniform3f", "glUniform4f",
    "glUniformMatrix4fv",
    "glActiveTexture",
    "glDrawArrays", "glDrawElements",
    "glClear", "glClearColor", "glViewport",

    // constants
    "GL_ARRAY_BUFFER", "GL_ELEMENT_ARRAY_BUFFER", "GL_STATIC_DRAW",
    "GL_FLOAT", "GL_TRIANGLES", "GL_FALSE",
    "GL_VERTEX_SHADER", "GL_FRAGMENT_SHADER",
  ];

  const glslKeywords = [
    // types
    "void", "bool", "int", "uint", "float", "double",
    "vec2", "vec3", "vec4",
    "ivec2", "ivec3", "ivec4",
    "bvec2", "bvec3", "bvec4",
    "mat2", "mat3", "mat4",
    "sampler2D", "samplerCube",

    // qualifiers
    "uniform", "in", "out", "inout",
    "attribute", "varying",
    "layout",

    // shader built-in variables
    "gl_Position", "gl_FragColor", "gl_FragCoord", "gl_VertexID",
    "gl_InstanceID", "gl_PointSize", "gl_PointCoord",

    // functions
    "radians", "degrees", "sin", "cos", "tan",
    "asin", "acos", "atan",
    "pow", "exp", "log", "exp2", "log2",
    "sqrt", "inversesqrt",
    "abs", "floor", "ceil", "fract",
    "min", "max", "clamp", "mix", "step", "smoothstep",
    "length", "distance", "dot", "cross", "normalize",
    "reflect", "refract",
    "texture", "texture2D", "textureCube",
  ];

  const keywords = [
    ...jsKeywords,
    ...csharpKeywords,
    ...pythonKeywords,
    ...openglKeywords,
    ...glslKeywords,
  ]

  const keywordRegex = new RegExp(`\\b(${keywords.join("|")})\\b`, "g");
  const symbolRegex = /([=+\-*/%""`!?:;.,()[\]{}<>])/g;

  const spans: string[] = [];
  let tempCode = code;

  const storeSpan = (match: string) => {
    const placeholder = `__HL_${spans.length}__`;
    spans.push(`<span class="text-green-900 font-semibold">${match}</span>`);
    return placeholder;
  };

  // Step 1: Replace keywords and symbols with placeholders
  tempCode = tempCode.replace(keywordRegex, storeSpan);
  tempCode = tempCode.replace(symbolRegex, storeSpan);

  // Step 2: Escape the entire result
  tempCode = tempCode
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Step 3: Restore highlighted spans
  spans.forEach((span, i) => {
    const placeholder = `__HL_${i}__`;
    tempCode = tempCode.replace(placeholder, span);
  });

  return tempCode;
}