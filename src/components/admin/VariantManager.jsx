// src/components/admin/VariantManager.jsx
import { useState, useEffect } from 'react'

const SIZE_PRESETS = {
  western: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  ethnic: ['34', '36', '38', '40', '42', '44', '46', '48'],
  free: ['Free Size'],
}

const PRESET_COLORS = [
  'Red', 'Blue', 'Green', 'Black', 'White', 'Yellow',
  'Pink', 'Purple', 'Orange', 'Brown', 'Grey', 'Beige',
  'Navy', 'Maroon', 'Gold', 'Silver', 'Cream', 'Peach',
]

export default function VariantManager({ variants = [], onChange }) {
  const [sizeType, setSizeType] = useState('western')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [colors, setColors] = useState([])
  const [colorInput, setColorInput] = useState('')
  const [stockGrid, setStockGrid] = useState({})
  // { 'Red': { 'S': 0, 'M': 0 }, 'Blue': { 'S': 0, 'M': 5 } }

  // Initialize from props on mount
  useEffect(() => {
    if (variants && variants.length > 0) {
      const initialColors = [...new Set(variants.map(v => v.color))]
      const initialSizes = [...new Set(variants.map(v => v.size))]
      
      const grid = {}
      initialColors.forEach(c => {
        grid[c] = {}
        initialSizes.forEach(s => {
          const v = variants.find(variant => variant.color === c && variant.size === s)
          grid[c][s] = v ? v.stock_quantity : 0
        })
      })
      
      setColors(initialColors)
      setSelectedSizes(initialSizes)
      setStockGrid(grid)
      setSizeType('custom')
    }
  }, []) // Empty dependency array to only run on mount

  // Sync grid → variants output whenever grid changes
  useEffect(() => {
    if (colors.length === 0 || selectedSizes.length === 0) {
      onChange([])
      return
    }

    const result = []
    colors.forEach(color => {
      selectedSizes.forEach(size => {
        result.push({
          color,
          size,
          stock_quantity: stockGrid[color]?.[size] ?? 0,
        })
      })
    })
    onChange(result)
  }, [stockGrid, colors, selectedSizes])

  // ── Size Type Change ──────────────────────────────
  const handleSizeTypeChange = (type) => {
    setSizeType(type)
    if (type === 'custom') {
      setSelectedSizes([])
    } else {
      setSelectedSizes(SIZE_PRESETS[type])
      // rebuild grid with new sizes
      rebuildGrid(colors, SIZE_PRESETS[type])
    }
  }

  // ── Toggle Size ───────────────────────────────────
  const toggleSize = (size) => {
    const updated = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size]
    setSelectedSizes(updated)
    rebuildGrid(colors, updated)
  }

  // ── Add Custom Size ───────────────────────────────
  const [customSize, setCustomSize] = useState('')
  const addCustomSize = () => {
    const s = customSize.trim()
    if (!s || selectedSizes.includes(s)) return
    const updated = [...selectedSizes, s]
    setSelectedSizes(updated)
    rebuildGrid(colors, updated)
    setCustomSize('')
  }

  // ── Add Color ─────────────────────────────────────
  const addColor = (color) => {
    const c = color.trim()
    if (!c || colors.includes(c)) return
    const updated = [...colors, c]
    setColors(updated)
    rebuildGrid(updated, selectedSizes)
    setColorInput('')
  }

  const removeColor = (color) => {
    const updated = colors.filter(c => c !== color)
    setColors(updated)
    const newGrid = { ...stockGrid }
    delete newGrid[color]
    setStockGrid(newGrid)
  }

  // ── Rebuild Grid ──────────────────────────────────
  const rebuildGrid = (cols, sizes) => {
    setStockGrid(prev => {
      const newGrid = {}
      cols.forEach(color => {
        newGrid[color] = {}
        sizes.forEach(size => {
          newGrid[color][size] = prev[color]?.[size] ?? 0
        })
      })
      return newGrid
    })
  }

  // ── Stock Cell Change ─────────────────────────────
  const handleCellChange = (color, size, value) => {
    setStockGrid(prev => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: parseInt(value) || 0,
      }
    }))
  }

  // ── Fill Entire Row (same stock for all sizes) ────
  const fillRow = (color, value) => {
    setStockGrid(prev => {
      const row = {}
      selectedSizes.forEach(size => { row[size] = parseInt(value) || 0 })
      return { ...prev, [color]: row }
    })
  }

  // ── Fill Entire Column (same stock for all colors) ─
  const fillColumn = (size, value) => {
    setStockGrid(prev => {
      const newGrid = { ...prev }
      colors.forEach(color => {
        newGrid[color] = { ...newGrid[color], [size]: parseInt(value) || 0 }
      })
      return newGrid
    })
  }

  // ── Summary ───────────────────────────────────────
  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0)
  const uniqueColors = [...new Set(variants.map(v => v.color))]
  const uniqueSizes = [...new Set(variants.map(v => v.size))]

  return (
    <div className="space-y-6">

      {/* Step 1 — Size Type */}
      <div>
        <p className="text-[10px] text-black/40 tracking-widest uppercase mb-3">
          Step 1 · Select Size Type
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'western', label: 'Western (S M L XL)' },
            { id: 'ethnic', label: 'Ethnic / Suits (38 40 42)' },
            { id: 'free', label: 'Free Size' },
            { id: 'custom', label: 'Custom' },
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSizeTypeChange(opt.id)}
              className={`px-4 py-2 text-xs border font-medium tracking-wide transition-colors
                ${sizeType === opt.id
                  ? 'bg-black border-black text-white'
                  : 'border-black/20 text-black/50 hover:border-black hover:text-black'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      {sizeType !== 'free' && (
        <div>
          <p className="text-[10px] text-black/40 tracking-widest uppercase mb-2">
            Select Sizes
          </p>
          <div className="flex flex-wrap gap-2">
            {(SIZE_PRESETS[sizeType] || []).map(size => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`w-12 h-10 text-xs border font-medium transition-colors
                  ${selectedSizes.includes(size)
                    ? 'bg-black border-black text-white'
                    : 'border-black/20 text-black/50 hover:border-black hover:text-black'
                  }`}
              >
                {size}
              </button>
            ))}

            {/* Custom size input */}
            {sizeType === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSize}
                  onChange={e => setCustomSize(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomSize()}
                  placeholder="e.g. 42"
                  className="w-20 border border-black/20 px-2 py-1 text-sm text-center outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={addCustomSize}
                  className="px-3 py-1 bg-black text-white text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Selected sizes preview */}
          {selectedSizes.length > 0 && sizeType === 'custom' && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedSizes.map(s => (
                <span
                  key={s}
                  className="flex items-center gap-1 px-2 py-1 bg-black text-white text-xs"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => toggleSize(s)}
                    className="text-white/50 hover:text-white ml-1"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2 — Colors */}
      <div>
        <p className="text-[10px] text-black/40 tracking-widests uppercase mb-3">
          Step 2 · Add Colors
        </p>

        {/* Preset colors */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => addColor(c)}
              disabled={colors.includes(c)}
              className={`px-2.5 py-1 text-xs border transition-colors
                ${colors.includes(c)
                  ? 'bg-black border-black text-white cursor-default'
                  : 'border-black/20 text-black/50 hover:border-black hover:text-black'
                }`}
            >
              {colors.includes(c) ? `✓ ${c}` : c}
            </button>
          ))}
        </div>

        {/* Custom color input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={colorInput}
            onChange={e => setColorInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addColor(colorInput)}
            placeholder="Type custom color..."
            className="flex-1 border border-black/20 px-3 py-2 text-sm text-black outline-none focus:border-black placeholder:text-black/20"
          />
          <button
            type="button"
            onClick={() => addColor(colorInput)}
            className="px-4 py-2 bg-black text-white text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-colors"
          >
            Add
          </button>
        </div>

        {/* Selected colors */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {colors.map(c => (
              <span
                key={c}
                className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs"
              >
                {c}
                <button
                  type="button"
                  onClick={() => removeColor(c)}
                  className="text-white/40 hover:text-white"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Step 3 — Stock Matrix */}
      {colors.length > 0 && selectedSizes.length > 0 && (
        <div>
          <p className="text-[10px] text-black/40 tracking-widests uppercase mb-3">
            Step 3 · Fill Stock
          </p>

          <div className="overflow-x-auto border border-black/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-black/10">
                  {/* Color header */}
                  <th className="text-left px-4 py-3 text-[10px] tracking-widests uppercase text-black/40 font-medium w-28">
                    Color
                  </th>

                  {/* Size headers */}
                  {selectedSizes.map(size => (
                    <th
                      key={size}
                      className="px-2 py-3 text-center"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] tracking-widests uppercase text-black/40 font-medium">
                          {size}
                        </p>
                        {/* Fill column button */}
                        <FillColumnButton
                          onFill={(val) => fillColumn(size, val)}
                        />
                      </div>
                    </th>
                  ))}

                  {/* Fill row header */}
                  <th className="px-3 py-3 text-[10px] tracking-widests uppercase text-black/40 font-medium text-center">
                    Fill All
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/5">
                {colors.map(color => (
                  <tr key={color} className="hover:bg-cream/50 transition-colors">

                    {/* Color name */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-black uppercase tracking-wide">
                        {color}
                      </p>
                    </td>

                    {/* Stock cells */}
                    {selectedSizes.map(size => (
                      <td key={size} className="px-2 py-3 text-center">
                        <input
                          type="number"
                          min="0"
                          value={stockGrid[color]?.[size] ?? 0}
                          onChange={e =>
                            handleCellChange(color, size, e.target.value)
                          }
                          className={`
                            w-14 text-center border py-1.5 text-sm outline-none
                            transition-colors focus:border-black
                            ${(stockGrid[color]?.[size] ?? 0) > 0
                              ? 'border-black/30 bg-white text-black font-medium'
                              : 'border-black/10 bg-cream text-black/30'
                            }
                          `}
                        />
                      </td>
                    ))}

                    {/* Fill row button */}
                    <td className="px-3 py-3 text-center">
                      <FillRowButton
                        onFill={(val) => fillRow(color, val)}
                      />
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-3 bg-cream border border-black/10 px-4 py-3 flex flex-wrap gap-4">
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widests">
                Total Stock
              </p>
              <p className="text-sm font-semibold text-black">
                {totalStock} units
              </p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widests">
                Colors
              </p>
              <p className="text-sm font-semibold text-black">
                {uniqueColors.length}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widests">
                Sizes
              </p>
              <p className="text-sm font-semibold text-black">
                {uniqueSizes.length}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-black/30 uppercase tracking-widests">
                Variants
              </p>
              <p className="text-sm font-semibold text-black">
                {variants.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {(colors.length === 0 || selectedSizes.length === 0) && (
        <div className="border border-dashed border-black/10 p-8 text-center">
          <p className="text-black/30 text-sm">
            {colors.length === 0 && selectedSizes.length === 0
              ? 'Select sizes and add colors to create variants'
              : colors.length === 0
                ? 'Add at least one color'
                : 'Select at least one size'
            }
          </p>
        </div>
      )}

    </div>
  )
}

// ── Helper Components ─────────────────────────────────────────

function FillRowButton({ onFill }) {
  const [show, setShow] = useState(false)
  const [val, setVal] = useState('')

  const handleFill = () => {
    onFill(val)
    setVal('')
    setShow(false)
  }

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="px-2 py-1 text-[10px] border border-black/20 text-black/40 hover:border-black hover:text-black transition-colors uppercase tracking-wide whitespace-nowrap"
      >
        Fill →
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleFill()}
        placeholder="0"
        min="0"
        autoFocus
        className="w-12 border border-black text-center py-1 text-xs outline-none"
      />
      <button
        type="button"
        onClick={handleFill}
        className="px-1.5 py-1 bg-black text-white text-xs hover:bg-gold hover:text-black transition-colors"
      >
        ✓
      </button>
      <button
        type="button"
        onClick={() => setShow(false)}
        className="text-black/30 hover:text-black text-xs"
      >
        ✕
      </button>
    </div>
  )
}

function FillColumnButton({ onFill }) {
  const [show, setShow] = useState(false)
  const [val, setVal] = useState('')

  const handleFill = () => {
    onFill(val)
    setVal('')
    setShow(false)
  }

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="px-1.5 py-0.5 text-[9px] border border-black/10 text-black/30 hover:border-black hover:text-black transition-colors uppercase tracking-wide"
      >
        Fill ↓
      </button>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        type="number"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleFill()}
        placeholder="0"
        min="0"
        autoFocus
        className="w-12 border border-black text-center py-0.5 text-xs outline-none"
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleFill}
          className="px-1 py-0.5 bg-black text-white text-[9px] hover:bg-gold hover:text-black transition-colors"
        >
          ✓
        </button>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="text-black/30 hover:text-black text-[9px]"
        >
          ✕
        </button>
      </div>
    </div>
  )
}