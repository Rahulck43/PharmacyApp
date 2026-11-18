interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar" role="search">
      <label htmlFor="medicine-search">Search medicines</label>
      <div className="search-input-row">
        <input
          id="medicine-search"
          type="search"
          placeholder="Name or brand"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />
        {value && (
          <button type="button" className="button-secondary" onClick={() => onChange('')}>
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
