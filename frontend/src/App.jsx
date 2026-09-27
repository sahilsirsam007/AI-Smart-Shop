import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react'
import './App.css'

const categories = ['Everything', 'Laptops', 'Phones', 'Audio', 'Wearables', 'Accessories', 'Shoes']
const starterPrompts = ['Laptop for coding under ₹70,000', 'Best headphones for travel', 'Show me Samsung phones']
const money = (amount) => `₹${amount.toLocaleString('en-IN')}`

function App() {
  const [catalogResult, setCatalogResult] = useState(null)
  const [category, setCategory] = useState('Everything')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const [selected, setSelected] = useState([])
  const [favorites, setFavorites] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [bagCount, setBagCount] = useState(0)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hey there. Tell me what you’re looking for and I’ll find a few good matches.' },
  ])
  const [message, setMessage] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const messageEnd = useRef(null)
  const params = new URLSearchParams()
  if (search.trim()) params.set('q', search.trim())
  if (category !== 'Everything') params.set('category', category)
  if (sort !== 'featured') params.set('sort', sort)
  const catalogQuery = params.toString()
  const currentCatalog = catalogResult?.query === catalogQuery ? catalogResult : null
  const products = currentCatalog?.products ?? []
  const loading = !currentCatalog
  const error = currentCatalog?.error ?? ''

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/products?${catalogQuery}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('The catalog could not be loaded.')
        return response.json()
      })
      .then((result) => setCatalogResult({ query: catalogQuery, products: result, error: '' }))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setCatalogResult({ query: catalogQuery, products: [], error: 'The product catalog is unavailable. Check that the API server is running.' })
        }
      })

    return () => controller.abort()
  }, [catalogQuery])

  useEffect(() => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, chatLoading])

  async function sendMessage(event, prompt = message) {
    event?.preventDefault()
    const text = prompt.trim()
    if (!text || chatLoading) return

    setMessage('')
    setMessages((current) => [...current, { role: 'user', text }])
    setChatLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'The assistant could not answer right now.')
      setMessages((current) => [...current, { role: 'assistant', text: result.reply, products: result.products }])
    } catch (requestError) {
      setMessages((current) => [...current, { role: 'assistant', text: requestError.message }])
    } finally {
      setChatLoading(false)
    }
  }

  function toggleCompare(product) {
    setSelected((current) => {
      if (current.some((item) => item.id === product.id)) return current.filter((item) => item.id !== product.id)
      if (current.length === 3) return current
      return [...current, product]
    })
  }

  function toggleFavorite(productId) {
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId])
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="SmartShop home"><span className="wordmark-mark">s.</span>smartshop</a>
        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-active" href="#discover">Discover</a>
          <a href="#assistant">Ask the assistant</a>
        </nav>
        <div className="header-actions">
          <span className="delivery-note"><span className="delivery-dot" /> Thoughtful finds, delivered</span>
          <button className="bag-button" type="button" aria-label={`Shopping bag, ${bagCount} items`}>
            <ShoppingBag size={18} strokeWidth={1.8} />
            <span>Bag</span><span className="bag-count">{bagCount}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> A little less scrolling, a lot more finding</p>
            <h1 id="hero-title">Good things.<br /><em>Found for you.</em></h1>
            <p className="hero-description">A smarter way to find the things you’ll actually love. Tell us what matters; we’ll handle the shortlist.</p>
            <a className="hero-link" href="#discover">Explore the edit <ArrowRight size={16} /></a>
            <div className="hero-proof"><div className="proof-avatars"><span>A</span><span>M</span><span>R</span></div><span>Better picks, made personal</span><span className="proof-stars"><Star size={13} fill="currentColor" /> 4.9</span></div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1300&q=90" alt="A slim laptop on a bright, considered workspace" />
            <div className="hero-note"><span className="note-spark"><Sparkles size={16} /></span><span><strong>Your next great find</strong><small>Picked around what you need</small></span><ArrowUpRight size={17} /></div>
            <span className="hero-index">THE SMARTER SHORTLIST · 01/06</span>
          </div>
          <div className="hero-side-note">FIND YOUR<br />EVERYDAY<br />FAVOURITES <ArrowDownWideNarrow size={16} /></div>
        </section>

        <section className="shop-section" id="discover">
          <div className="section-heading">
            <div><p className="eyebrow section-kicker">A considered collection</p><h2>Find your next <em>favourite.</em></h2></div>
            <p className="section-aside">Good picks, no endless tabs.<br />Just the things worth a closer look.</p>
          </div>
          <div className="shop-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Product categories">
              {categories.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? 'category-tab active' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <label className="search-field"><Search size={17} /><input aria-label="Search products" placeholder="Search the edit" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          </div>

          <div className="catalog-layout">
            <div className="product-area">
              <div className="results-bar"><p>{search || category !== 'Everything' ? <><strong>{products.length}</strong> thoughtful {products.length === 1 ? 'find' : 'finds'}</> : <>The good stuff <span className="result-count">{products.length} finds</span></>}</p><label className="sort-field"><SlidersHorizontal size={15} /><span>Sort:</span><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="rating">Top rated</option></select><ChevronDown size={14} /></label></div>
              {error && <div className="catalog-message" role="alert"><CircleHelp size={19} /><span>{error}</span></div>}
              {loading ? <div className="catalog-message">Finding the good stuff…</div> : products.length ? <div className="product-grid">
                {products.map((product, index) => {
                  const isSelected = selected.some((item) => item.id === product.id)
                  return <article className="product-card" key={product.id} style={{ '--card-index': index }}>
                    <div className="product-image-wrap"><img className="product-image" src={product.image} alt={product.name} loading="lazy" /><span className="product-badge">{product.badge}</span><button className={favorites.includes(product.id) ? 'save-button is-saved' : 'save-button'} aria-label={favorites.includes(product.id) ? `Remove ${product.name} from saved items` : `Save ${product.name}`} aria-pressed={favorites.includes(product.id)} title="Save product" type="button" onClick={() => toggleFavorite(product.id)}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><button className={isSelected ? 'compare-toggle selected' : 'compare-toggle'} type="button" onClick={() => toggleCompare(product)} aria-pressed={isSelected} title={isSelected ? 'Remove from comparison' : 'Add to comparison'}>{isSelected ? <Check size={15} /> : <Plus size={15} />}<span>{isSelected ? 'Added' : 'Compare'}</span></button></div>
                    <div className="product-details"><div className="product-meta"><span>{product.brand}</span><span className="rating"><Star size={13} fill="currentColor" /> {product.rating} <span className="review-count">({product.reviews})</span></span></div><h3>{product.name}</h3><p className="product-description">{product.description}</p><div className="product-bottom"><div className="price-stack"><strong>{money(product.price)}</strong>{product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}</div><button className="add-button" type="button" onClick={() => setBagCount((count) => count + 1)} aria-label={`Add ${product.name} to bag`}><Plus size={17} /></button></div></div>
                  </article>
                })}
              </div> : <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h3>No finds this time.</h3><p>Try another search or browse everything.</p><button type="button" onClick={() => { setSearch(''); setCategory('Everything') }}>Clear filters <ArrowRight size={15} /></button></div>}
              <div className="catalog-footnote"><Sparkles size={14} /> A small, handpicked demo collection. Product data is sample content.</div>
            </div>

            <aside className="assistant-panel" id="assistant" aria-label="SmartShop shopping assistant">
              <div className="assistant-head"><div className="assistant-title"><span className="assistant-avatar"><Sparkles size={17} /></span><span><strong>Your shopping sidekick</strong><small><i /> Here to find your fit</small></span></div><button type="button" className="icon-button" title="About the assistant" aria-label="About the assistant"><CircleHelp size={17} /></button></div>
              <div className="chat-intro"><span>SMARTSHOP ASSISTANT</span><p>Know what you need? Tell me the details. I’ll find a few worth your time.</p></div>
              <div className="chat-messages" aria-live="polite">
                {messages.map((item, index) => <div className={`chat-message ${item.role}`} key={`${item.role}-${index}`}><p>{item.text}</p>{item.products?.length > 0 && <div className="chat-recommendations">{item.products.map((product) => <button key={product.id} type="button" onClick={() => { setSearch(product.name); setCategory('Everything') }}><span>{product.name}<small>{product.brand} · {money(product.price)}</small></span><ArrowUpRight size={15} /></button>)}</div>}</div>)}
                {chatLoading && <div className="chat-message assistant typing"><span /><span /><span /></div>}
                <div ref={messageEnd} />
              </div>
              {messages.length === 1 && <div className="prompt-suggestions">{starterPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => sendMessage(null, prompt)}>{prompt}<ArrowUpRight size={13} /></button>)}</div>}
              <form className="chat-compose" onSubmit={(event) => sendMessage(event)}><input aria-label="Ask for a product recommendation" placeholder="Tell me what you’re after…" value={message} onChange={(event) => setMessage(event.target.value)} /><button type="submit" aria-label="Send message" disabled={!message.trim() || chatLoading}><Send size={16} /></button></form>
              <div className="assistant-foot"><Sparkles size={12} /> Recommendations are based on the products shown here</div>
            </aside>
          </div>
        </section>
      </main>

      <footer className="site-footer"><a className="wordmark footer-wordmark" href="#top"><span className="wordmark-mark">s.</span>smartshop</a><span>A little more thoughtful shopping.</span><a href="#assistant"><MessageCircle size={15} /> Ask us something</a></footer>

      {selected.length > 0 && <div className="compare-dock"><div className="compare-dock-copy"><span className="compare-dock-icon"><SlidersHorizontal size={16} /></span><span><strong>Compare your picks</strong><small>{selected.length} of 3 selected</small></span></div><div className="compare-thumbs">{selected.map((product) => <span key={product.id} title={product.name}><img src={product.image} alt="" /><button type="button" aria-label={`Remove ${product.name}`} onClick={() => toggleCompare(product)}><X size={11} /></button></span>)}</div><button className="compare-open" type="button" disabled={selected.length < 2} onClick={() => setCompareOpen(true)}>Compare <ArrowRight size={15} /></button><button className="dock-close" type="button" title="Clear comparison" aria-label="Clear comparison" onClick={() => setSelected([])}><X size={17} /></button></div>}

      {compareOpen && <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setCompareOpen(false) }}><section className="compare-modal" role="dialog" aria-modal="true" aria-labelledby="compare-title"><div className="modal-heading"><div><p className="eyebrow">Side by side</p><h2 id="compare-title">The details, <em>together.</em></h2></div><button className="icon-button modal-close" type="button" aria-label="Close comparison" onClick={() => setCompareOpen(false)}><X size={20} /></button></div><div className="compare-table-wrap"><table className="compare-table"><thead><tr><th scope="col">At a glance</th>{selected.map((product) => <th scope="col" key={product.id}><img src={product.image} alt="" /><span>{product.name}</span></th>)}</tr></thead><tbody><tr><th scope="row">Price</th>{selected.map((product) => <td key={product.id}><strong>{money(product.price)}</strong></td>)}</tr><tr><th scope="row">Brand</th>{selected.map((product) => <td key={product.id}>{product.brand}</td>)}</tr><tr><th scope="row">Rating</th>{selected.map((product) => <td key={product.id}><span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span></td>)}</tr><tr><th scope="row">Features</th>{selected.map((product) => <td key={product.id}><ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></td>)}</tr></tbody></table></div></section></div>}
    </div>
  )
}

export default App
