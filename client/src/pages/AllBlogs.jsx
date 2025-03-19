"use client"

import { useState, useEffect, useContext, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"
import { AppContent } from "../context/AppContext"
import BlogCard from "../components/blog/BlogCard"
import { Edit, Loader2, Search, Filter, X } from "lucide-react"

function AllBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    sortBy: "newest",
    tags: [],
  })
  const [availableTags, setAvailableTags] = useState([
    "mental health",
    "self-care",
    "wellness",
    "anxiety",
    "depression",
    "mindfulness",
    "therapy",
    "stress",
    "healing",
    "support",
  ])

  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContent)
  const searchInputRef = useRef(null)

  // Create a ref for the intersection observer
  const observer = useRef()
  const lastBlogElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  const fetchBlogs = async (pageNum, search = "", filterParams = filters) => {
    try {
      setLoading(true)
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ""
      const sortParam = `&sort=${filterParams.sortBy}`
      const tagsParam = filterParams.tags.length > 0 ? `&tags=${filterParams.tags.join(",")}` : ""

      const { data } = await axios.get(
        `${backendUrl}/api/blogs?page=${pageNum}&limit=9${searchParam}${sortParam}${tagsParam}`,
        { withCredentials: true },
      )

      if (data.success) {
        if (pageNum === 1) {
          setBlogs(data.blogs)
        } else {
          setBlogs((prev) => [...prev, ...data.blogs])
        }
        setHasMore(data.hasMore)
      }
    } catch (error) {
      toast.error("Error fetching blogs")
    } finally {
      setLoading(false)
      setInitialLoad(false)
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
          withCredentials: true,
        })
        if (!data.success) {
          navigate("/login")
        } else {
          // Reset page and fetch initial blogs
          setPage(1)
          fetchBlogs(1)
        }
      } catch (error) {
        navigate("/login")
      }
    }

    checkAuth()
  }, []) // Initial auth check and blog fetch

  useEffect(() => {
    if (page > 1 && !isSearching) {
      fetchBlogs(page, searchTerm, filters)
    }
  }, [page])

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    setIsSearching(true)
    setPage(1)
    fetchBlogs(1, searchTerm, filters)
  }

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters }

    if (filterType === "sortBy") {
      newFilters.sortBy = value
    } else if (filterType === "tags") {
      if (newFilters.tags.includes(value)) {
        newFilters.tags = newFilters.tags.filter((tag) => tag !== value)
      } else {
        newFilters.tags = [...newFilters.tags, value]
      }
    }

    setFilters(newFilters)
    setPage(1)
    fetchBlogs(1, searchTerm, newFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    const newFilters = { sortBy: "newest", tags: [] }
    setFilters(newFilters)
    setSearchTerm("")
    setPage(1)
    fetchBlogs(1, "", newFilters)
  }

  // Handle like updates at the page level
  const handleLikeUpdate = (blogId, liked, likeCount) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId
          ? { ...blog, likes: [...blog.likes] } // Create a new array to trigger re-render
          : blog,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-lighter/20 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Discover Stories</h1>
            <p className="text-gray-600 mt-1">Explore ideas, perspectives, and knowledge</p>
          </div>

          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light bg-white text-gray-800"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 text-gray-500" disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </button>
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 border rounded-lg transition-colors flex items-center gap-1 ${
                showFilters || filters.tags.length > 0
                  ? "bg-primary-lighter/20 border-primary-lighter text-primary"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Filter className="h-4 w-4" />
              {filters.tags.length > 0 && (
                <span className="text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.tags.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/blog/new")}
              className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <Edit className="h-4 w-4" />
              Write
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-primary">Filter Stories</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">Sort by</h4>
                <div className="flex flex-wrap gap-2">
                  {["newest", "oldest", "popular"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterChange("sortBy", option)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.sortBy === option
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleFilterChange("tags", tag)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        filters.tags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {initialLoad ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-xl shadow-md p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => {
                if (blogs.length === index + 1 && hasMore) {
                  return (
                    <div
                      ref={lastBlogElementRef}
                      key={blog._id}
                      className="transform transition-transform duration-300 hover:scale-102"
                    >
                      <BlogCard blog={blog} onLikeUpdate={handleLikeUpdate} />
                    </div>
                  )
                } else {
                  return (
                    <div key={blog._id} className="transform transition-transform duration-300 hover:scale-102">
                      <BlogCard blog={blog} onLikeUpdate={handleLikeUpdate} />
                    </div>
                  )
                }
              })}
            </div>

            {loading && !initialLoad && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more stories
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary-lighter/20 rounded-full">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-primary">
              {searchTerm || filters.tags.length > 0
                ? "No stories found matching your search"
                : "No stories available yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filters.tags.length > 0
                ? "Try a different search term or browse all stories"
                : "Be the first to share your ideas with the community"}
            </p>
            {searchTerm || filters.tags.length > 0 ? (
              <button
                onClick={clearFilters}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                View all stories
              </button>
            ) : (
              <button
                onClick={() => navigate("/blog/new")}
                className="bg-gradient-to-r from-primary to-primary-light hover:opacity-90 text-white px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 mx-auto shadow-md"
              >
                <Edit className="h-4 w-4" />
                Write the first story
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllBlogs

