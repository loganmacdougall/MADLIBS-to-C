import { CBlank } from "./Blanks";

interface CodeProps {
  story: string,
  blanks: CBlank[]
}

let currentPopupTimeout: any = null

function Code({ story, blanks }: CodeProps) {
  return <div id="code-container">
    <img id="copy-button" src="/Copy.svg" alt="Click to copy" title="Click to copy" onClick={copyCode} />
    <pre id="code">
      {"#include\<stdio.h\>"}<br />
      <br />
      {"int main(void) {"}<br />
      {blanks.length > 0 ? variableInitialize(blanks) : ""}
      {blanks.length > 0 ? <br /> : ""}
      {blanks.map(b => getVariable(b))}<br />
      {printStory(story, blanks)} <br />
      <br />
      {"\treturn 0;"}<br />
      {"}"}<br />
    </pre>
  </div>
}

function printStory(story: string, blanks: CBlank[]) {
  let cleanStoryArr = Array.from(story).filter((c, _i, _a) => c != '"')
  // Fix bad percent signs
  let illegalPercentLocs: number[] = []
  for (let i = 0; i < cleanStoryArr.length; i++) {
    if (cleanStoryArr[i] == "%" && cleanStoryArr[i + 1] != "s")
      illegalPercentLocs.push(i)
  }
  illegalPercentLocs.forEach((i, o) => {
    let index = i + o
    cleanStoryArr.splice(index, 0, "\\")
  })

  // Replace enter spaces with "\n"
  let illegalEnterLocs: number[] = []
  for (let i = 0; i < cleanStoryArr.length; i++) {
    if (cleanStoryArr[i] == "\n")
      illegalEnterLocs.push(i)
  }
  illegalEnterLocs.forEach((i, _o) => {
    let index = i
    cleanStoryArr.splice(index, 1, "\\n")
  })
  let cleanStory = cleanStoryArr.join("")

  if (blanks.length == 0) {
    return `\tprintf(\"${cleanStory}\\n\");`
  }

  let variables = blanks.map(b => b.variable).join(", ")
  return `\tprintf(\"${cleanStory}\\n\", ${variables});`
}

function getVariable(blank: CBlank) {
  return <>
    <br />
    {`\tprintf("${blank.label}: ");`}<br />
    {`\tscanf("%s", ${blank.variable});`}<br />
  </>
}

function variableInitialize(blanks: CBlank[]) {
  let variables = blanks.map(b => b.variable + "[" + b.length + "]").join(", ")
  return "\tchar " + variables + ";"
}

async function copyCode() {
  let codeNode = document.getElementById("code")!

  await navigator.clipboard.writeText(codeNode.innerText)

  let popupNode = document.getElementById("copy-popup")!

  if (currentPopupTimeout === null) {
    popupNode.classList.add("popout")
  } else {
    clearTimeout(currentPopupTimeout)
  }
  currentPopupTimeout = setTimeout(() => {
    popupNode.classList.remove("popout")
    currentPopupTimeout = null
  }, 3000)
}

export default Code