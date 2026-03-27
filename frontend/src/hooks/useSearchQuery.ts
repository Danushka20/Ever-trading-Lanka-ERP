import { useState } from "react"

export function useSearchQuery(initialQuery: string = "") {
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  return {
    searchQuery,
    setSearchQuery,
    clearSearch: () => setSearchQuery(""),
    isSearching: searchQuery.length > 0,
  }
}
