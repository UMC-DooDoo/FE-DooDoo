interface TabBarProps {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}

function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`text-md flex-1 border-t-2 py-3 transition-colors ${
            active === tab
              ? 'border-neutral-900 font-semibold text-neutral-900'
              : 'border-transparent text-neutral-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default TabBar
