import { useState } from 'react'

import Story from './Story.tsx'
import Blanks from './Blanks.tsx'
import Code from './Code.tsx'
import { CBlank } from './Blanks.tsx'

function App() {

  let [story, setStory] = useState("")
  let [blanks, setBlanks] = useState<CBlank[]>([])



  return <>
    <h1 id='title'>MADLIBS to C Generator</h1>
    <Story story={story} setStory={setStory} />
    <Blanks story={story} setCBlanks={setBlanks} />
    <Code story={story} blanks={blanks} />
  </>
}

export default App
