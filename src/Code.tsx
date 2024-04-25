import { CBlank } from "./Blanks";

interface CodeProps {
  story: string,
  blanks: CBlank[]
}

function Code({ story, blanks }: CodeProps) {
  return <pre id="code">
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
}

function printStory(story: string, blanks: CBlank[]) {
  let cleanStoryArr = Array.from(story).filter((c, i, a) => c != '"')
  let illegalPercentLocs: number[] = []
  for (let i = 0; i < cleanStoryArr.length; i++) {
    if (cleanStoryArr[i] != "%" || (i < cleanStoryArr.length - 1 && cleanStoryArr[i + 1] == "s")) continue
    illegalPercentLocs.push(i)
  }
  illegalPercentLocs.forEach((i, o) => {
    let index = i + o
    cleanStoryArr.splice(index, 0, "\\")
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

export default Code