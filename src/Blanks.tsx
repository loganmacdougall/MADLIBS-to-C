import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Blank from "./Blank"

interface BlanksProps {
  story: string,
  setCBlanks: Dispatch<SetStateAction<CBlank[]>>,
}

type BlankData = {
  label: string
  length: number
}

export type CBlank = {
  label: string,
  variable: string,
  length: number
}


function Blanks({ story, setCBlanks }: BlanksProps) {
  let [blanks, setBlanks] = useState<BlankData[]>([])
  let [prevStory, setPrevStory] = useState(story)

  useEffect(() => {
    let blankLocs = findBlanks(story)

    // No change
    if (blankLocs.length == blanks.length) {
      setPrevStory(story)
      return
    }

    if (blankLocs.length == 0) {
      setBlanks([])
      setPrevStory(story)
      return
    }

    // Large change, regenerate all labels
    if (Math.abs(blankLocs.length - blanks.length) > 2) {
      let newBlanks: BlankData[] = blankLocs.map<BlankData>(_ => ({ label: "Input", length: 30 }))
      setBlanks(newBlanks)
      setPrevStory(story)
      return
    }

    // One change, find where the change was made and add a label in the correct position
    let prevBlankLocs = findBlanks(prevStory)
    let newBlanks = blanks.slice()

    let insertLoc = findInsert(blankLocs, prevBlankLocs)
    let removeLoc = findRemove(blankLocs, prevBlankLocs)
    if (insertLoc > -1) {
      newBlanks.splice(insertLoc, 0, { label: "Input", length: 30 });
    } else if (removeLoc > -1) {
      newBlanks.splice(removeLoc, 1)
    }

    setBlanks(newBlanks)
    setPrevStory(story)
  }, [story])

  useEffect(() => {
    let newCBlanks: CBlank[] = []
    for (let b of blanks) {
      let variable = cleanVariableName(b.label)
      if (newCBlanks.find(e => e.variable == variable)) {
        let i = 0
        for (; newCBlanks.find(e => e.variable == variable + "_" + i); i++);
        variable = variable + "_" + i
      }
      let cleanLabel = Array.from(b.label).filter(c => c != '%').join("")
      newCBlanks.push({
        variable: variable,
        label: cleanLabel,
        length: b.length
      })
    }
    setCBlanks(newCBlanks)
  }, [blanks])

  let getLengthSetter = (index: number) => {
    return (length: number) => {
      let newBlanks = blanks.slice()
      newBlanks[index].length = length
      setBlanks(newBlanks)
    }
  }

  let getLabelSetter = (index: number) => {
    return (label: string) => {
      let newBlanks = blanks.slice()
      newBlanks[index].label = label
      setBlanks(newBlanks)
    }
  }
  return <div id="blanks">
    {blanks.map((b, i) =>
      <Blank key={i} label={b.label} length={b.length} setLabel={getLabelSetter(i)} setLength={getLengthSetter(i)} />
    )}
  </div>

}

function findBlanks(str: string): number[] {
  let blankLocations: number[] = []
  for (let i = 1; i < str.length; i++) {
    if (str[i - 1] != "%") continue
    if (str[i] != "s") continue
    blankLocations.push(i)
  }
  return blankLocations
}

function findInsert(blanks: number[], prevBlanks: number[]): number {
  let len = Math.min(blanks.length, prevBlanks.length)
  for (let i = 0; i < len; i++) {
    if (blanks[i]! < prevBlanks[i]!) return i
  }
  if (blanks.length > prevBlanks.length) return blanks.length - 1
  return -1
}

function findRemove(blanks: number[], prevBlanks: number[]): number {
  let len = Math.min(blanks.length, prevBlanks.length)
  for (let i = 0; i < len; i++) {
    if (blanks[i]! > prevBlanks[i]!) return i
  }
  if (blanks.length < prevBlanks.length) return prevBlanks.length - 1
  return -1
}

function isAlpha(c: string) {
  return (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z')
}
function isNumeric(c: string) {
  return (c >= '0' && c <= '9')
}
function isAlphanumericOrUnderscore(c: string) {
  return isAlpha(c) || isNumeric(c) || c == '_'
}

function cleanVariableName(s: string) {
  let start = 0
  while (start < s.length && !(isAlpha(s[start]) || s[start] == '_')) start++
  if (start == s.length) return "Input"
  let cs = s.substring(start, s.length)
  cs = Array.from(cs).filter(isAlphanumericOrUnderscore).join("")
  return cs
}

export default Blanks