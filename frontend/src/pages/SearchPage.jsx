import { useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import SearchBar from '../components/search/SearchBar'
import SearchFilters from '../components/search/SearchFilters'
import SchemeGrid from '../components/scheme/SchemeGrid'
import ErrorBanner from '../components/ui/ErrorBanner'
import { getSchemes } from '../services/schemes'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ state: '', category: '', income: '', gender: '', age: '' })
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [meta, setMeta] = useState(null)

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim() && !filters.state) return
    setLoading(true)
    setError('')
    setSearched(true)
    try {
      const params = { q: query || filters.state, page: 1, page_size: 20 }
      if (filters.state) params.state = filters.state
      if (filters.category) params.category = filters.category
      if (filters.income) params.income = filters.income
      if (filters.gender) params.gender = filters.gender
      if (filters.age) params.age = filters.age
      const res = await getSchemes(params)
      setSchemes(res.data.data)
      setMeta(res.data.meta)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Search size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Find Schemes</h1>
            <p className="text-gov-muted text-sm">Search Central and State government welfare schemes</p>
          </div>
        </div>
      </div>

      <div className="mb-6 max-w-3xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          placeholder="Search Government Schemes..."
        />
      </div>

      <div className="mb-8">
        <SearchFilters filters={filters} onChange={setFilters} />
      </div>

      <ErrorBanner message={error} />

      {meta && (
        <p className="text-gov-muted text-sm mb-4">
          Found {meta.total} result{meta.total !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
        </p>
      )}

      <SchemeGrid
        schemes={schemes}
        loading={loading}
        emptyMessage={searched ? `No schemes found. Try different keywords or filters.` : 'Enter a keyword or select filters to search schemes.'}
      />
    </PageWrapper>
  )
}
