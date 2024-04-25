import { Dispatch, SetStateAction, useEffect } from "react"

interface StoryProps {
  story: string
  setStory: Dispatch<SetStateAction<string>>
}

function Story({ story, setStory }: StoryProps) {
  return <textarea name="story" id="story-textarea" placeholder="Enter your story here" cols={40} rows={5} value={story} onChange={e => setStory(e.target.value)} />
}

export default Story