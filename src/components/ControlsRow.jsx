import { useState } from 'react'

function ControlsRow() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  return (
    <section className="rounded-[28px] bg-zinc-200 p-4 shadow-sm ring-1 ring-zinc-300/70 sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        <label className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700">Search</span>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Search news"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
            />
            <button
              type="button"
              className="rounded-xl bg-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-800"
            >
              Search
            </button>
          </div>
        </label>

        <label className="flex min-w-0 w-full flex-col gap-2 md:w-auto md:min-w-48">
          <span className="text-sm font-medium text-zinc-700">Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
          />
        </label>

        <button
          type="button"
          className="w-full rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-950 md:w-auto"
        >
          Load News
        </button>

        <button
          type="button"
          className="w-full rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-800 ring-1 ring-zinc-300 transition hover:bg-zinc-50 md:w-auto"
        >
          Load Favorites
        </button>
      </div>
    </section>
  )
}

export default ControlsRow
