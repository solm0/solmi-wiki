export const tagsWColors = [
  {
    "id": "cmcbvu0p30002116yo8p9h936",
    "name": "방랑",
    "color": "var(--tag-travel)",
    "className": "tag-color-travel",
  },
  {
    "id": "cmm3lle9z00004vnuuxqggboq",
    "name": "셀프호스팅",
    "color": "var(--tag-self-hosting)",
    "className": "tag-color-self-hosting",
  },
  {
    "id": "cmm3lor8j00014vnuy2wz4lgx",
    "name": "OpenGL",
    "color": "var(--tag-opengl)",
    "className": "tag-color-opengl",
  },
  {
    "id": "cmm3lsael00024vnu4v0n1rbx",
    "name": "NLP",
    "color": "var(--tag-nlp)",
    "className": "tag-color-nlp",
  }
]

export function getTagColor(tagName?: string | null) {
  return tagsWColors.find((tag) => tag.name === tagName)?.color ?? "var(--button-100)";
}

export function getTagColorClass(tagName?: string | null) {
  return tagsWColors.find((tag) => tag.name === tagName)?.className ?? "bg-button-100";
}
