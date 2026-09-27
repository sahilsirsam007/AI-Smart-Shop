import cors from 'cors'
import express from 'express'
import { products } from './products.js'

const app = express()
const port = Number(process.env.PORT) || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', productCount: products.length })
})

app.get(['/api/products', '/api/products/search'], (request, response) => {
  const { q = '', category, maxPrice, sort = 'featured' } = request.query
  const normalizedQuery = String(q).trim().toLowerCase()
  let result = products.filter((product) => {
    const matchesQuery = !normalizedQuery || [
      product.name,
      product.category,
      product.brand,
      product.description,
      ...product.features,
    ].some((value) => value.toLowerCase().includes(normalizedQuery))
    const matchesCategory = !category || product.category === category
    const matchesPrice = !maxPrice || product.price <= Number(maxPrice)
    return matchesQuery && matchesCategory && matchesPrice
  })

  if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
  if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating)
  response.json(result)
})

app.get('/api/products/:id', (request, response) => {
  const product = products.find((item) => item.id === request.params.id)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  response.json(product)
})

app.post('/api/products/compare', (request, response) => {
  const { productIds } = request.body ?? {}
  if (!Array.isArray(productIds) || productIds.length < 2 || productIds.length > 3) {
    return response.status(400).json({ error: 'Choose two or three products to compare.' })
  }
  response.json(products.filter((product) => productIds.includes(product.id)))
})

app.post('/api/chat', (request, response) => {
  const message = String(request.body?.message ?? '').trim()
  if (!message) return response.status(400).json({ error: 'Write a shopping request first.' })

  const query = message.toLowerCase()
  const budgetMatch = query.match(/(?:under|below|less than|max(?:imum)?|within)\s*(?:₹|rs\.?\s*)?([\d,]+)/i)
    ?? query.match(/(?:₹|rs\.?\s*)([\d,]+)/i)
  const maxPrice = budgetMatch ? Number(budgetMatch[1].replaceAll(',', '')) : Infinity
  const categoryTerms = [
    { category: 'Laptops', terms: ['laptop', 'notebook', 'coding', 'computer'] },
    { category: 'Phones', terms: ['phone', 'mobile', 'smartphone', 'camera'] },
    { category: 'Audio', terms: ['headphone', 'headphones', 'audio', 'music', 'noise cancelling', 'earphone'] },
    { category: 'Wearables', terms: ['watch', 'wearable', 'running', 'fitness'] },
    { category: 'Accessories', terms: ['keyboard', 'accessory', 'accessories', 'desk'] },
    { category: 'Shoes', terms: ['shoe', 'shoes', 'sneaker', 'sneakers'] },
  ]
  const matchedCategory = categoryTerms.find(({ terms }) => terms.some((term) => query.includes(term)))?.category
  const matchedBrand = products.find((product) => query.includes(product.brand.toLowerCase()))?.brand
  const matches = products.filter((product) => product.price <= maxPrice
      && (!matchedCategory || product.category === matchedCategory)
      && (!matchedBrand || product.brand === matchedBrand))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  let reply
  if (!matches.length) {
    reply = `I couldn't find a ${matchedCategory ? matchedCategory.toLowerCase() + ' ' : ''}match within that budget. Try widening your budget or category.`
  } else if (Number.isFinite(maxPrice)) {
    reply = `I found ${matches.length} ${matchedCategory ? matchedCategory.toLowerCase() + ' ' : ''}option${matches.length === 1 ? '' : 's'} under ₹${maxPrice.toLocaleString('en-IN')}. ${matches[0].name} stands out at ${matches[0].rating} stars.`
  } else {
    reply = `Here are a few well-rated ${matchedCategory ? matchedCategory.toLowerCase() + ' ' : ''}picks from the catalog. ${matches[0].name} is currently rated ${matches[0].rating} stars.`
  }
  response.json({ reply, products: matches })
})

export { app }

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`SmartShop API listening on http://localhost:${port}`)
  })
}
