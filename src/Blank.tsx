interface BlankProps {
  label: string
  setLabel: (label: string) => any
  length: number,
  setLength: (length: number) => any
}

function Blank({ label, setLabel, length, setLength }: BlankProps) {
  return <div className="blank">
    <label>Type of Blank</label>
    <label>Input length</label>
    <input type="text" className="labelInput" value={label} onChange={e => setLabel(cleanLabel(e.target.value))} />
    <input type="number" className="lengthInput" min={1} max={1000} value={length} onChange={e => setLength(clamp(1, 1000, +e.target.value))} />
  </div>
}

function cleanLabel(str: string): string {
  return Array.from(str).filter(c => c != '%' && c != '"').join("")
}

function clamp(min: number, max: number, num: number): number {
  return Math.min(max, Math.max(min, num))
}

export default Blank