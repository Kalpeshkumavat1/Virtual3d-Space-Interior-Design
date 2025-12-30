import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Brain, Wand2, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { aiToolsAPI } from '../apis/aiTools'
import { toast } from 'react-toastify'

function PromptDesignLab() {
  const [prompt, setPrompt] = useState('Design a cozy yet modern living room for a young couple that works from home. Include a small workspace, plenty of storage, and warm lighting.')
  const [roomType, setRoomType] = useState('living')
  const [style, setStyle] = useState('modern')
  const [budget, setBudget] = useState('3000')
  const [dimensions, setDimensions] = useState({ width: '5', depth: '4', height: '2.8' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onGenerate = async (event) => {
    event.preventDefault()
    if (!prompt.trim()) {
      setError('Please describe how you want the space to feel.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const constraints = {
      roomType,
      style,
    }

    const parsedBudget = parseFloat(budget)
    if (!Number.isNaN(parsedBudget) && parsedBudget > 0) {
      constraints.budget = parsedBudget
    }

    const parsedDimensions = {}
    const width = parseFloat(dimensions.width)
    const depth = parseFloat(dimensions.depth)
    const height = parseFloat(dimensions.height)
    if (!Number.isNaN(width)) parsedDimensions.width = width
    if (!Number.isNaN(depth)) parsedDimensions.depth = depth
    if (!Number.isNaN(height)) parsedDimensions.height = height
    if (Object.keys(parsedDimensions).length > 0) {
      constraints.dimensions = parsedDimensions
    }

    const payload = {
      prompt: prompt.trim(),
      constraints: Object.keys(constraints).length ? constraints : undefined,
    }

    try {
      const response = await aiToolsAPI.promptDesign(payload)
      if (!response.success) {
        setError(response.message || 'Unable to generate design. Please sign in with a Pro plan and try again.')
        toast.error(response.message || 'AI design request failed')
        return
      }

      setResult(response.data)
      toast.success(response.message || 'AI design ready')
    } catch (err) {
      console.error(err)
      setError('Unexpected error while requesting AI design.')
      toast.error('Unexpected error while requesting AI design.')
    } finally {
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null

    return (
      <div className="space-y-6 mt-8">
        {result.usingFallback && (
          <div className="rounded-lg border border-yellow-400 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            AI service is running in fallback mode. Set <code className="font-mono">OPENAI_API_KEY</code> to enable live designs.
          </div>
        )}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-white">AI Concept Summary</CardTitle>
            <CardDescription className="text-gray-300">{result.summary}</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Layout & Zoning</CardTitle>
              <CardDescription className="text-gray-400">How the AI recommends using your space</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.layoutPlan?.zones?.map((zone, index) => (
                <div key={index} className="rounded-lg border border-gray-800 p-4">
                  <div className="text-green-400 font-semibold">{zone.name}</div>
                  <p className="text-gray-300 text-sm mt-1">{zone.details}</p>
                </div>
              ))}
              {result.layoutPlan?.circulation && (
                <div>
                  <div className="text-sm font-semibold text-gray-200 mb-2">Circulation Tips</div>
                  <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                    {result.layoutPlan.circulation.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Furniture Plan</CardTitle>
              <CardDescription className="text-gray-400">Categories and hero pieces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.furniturePlan?.map((group, groupIndex) => (
                <div key={groupIndex} className="rounded-lg border border-gray-800 p-4">
                  <div className="text-green-400 font-semibold mb-2">{group.category}</div>
                  <div className="space-y-3">
                    {group.suggestions?.map((item, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        <div className="font-semibold text-white">{item.name}</div>
                        <p className="text-gray-400">{item.placement}</p>
                        {item.approxCost && (
                          <p className="text-gray-500">Approx. ${item.approxCost}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Color Palettes</CardTitle>
              <CardDescription className="text-gray-400">AI curated colors for the vibe you described</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.colorPalettes?.map((palette, paletteIndex) => (
                <div key={paletteIndex} className="rounded-lg border border-gray-800 p-4 space-y-3">
                  <div className="text-white font-semibold">{palette.name}</div>
                  <p className="text-gray-400 text-sm">{palette.description}</p>
                  <div className="flex gap-2">
                    {palette.colors?.map((color, index) => (
                      <div key={index} className="flex-1">
                        <div className="h-12 rounded-lg border border-gray-800" style={{ backgroundColor: color.hex }}></div>
                        <div className="text-xs text-gray-300 mt-1">{color.hex}</div>
                        <div className="text-[11px] text-gray-500">{color.usage}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Action Plan</CardTitle>
              <CardDescription className="text-gray-400">Steps to bring this concept to life</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.actionSteps?.map((step, index) => (
                <div key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
              {result.estimatedBudget && (
                <div className="mt-4 rounded-lg border border-gray-800 p-4">
                  <div className="text-white font-semibold">Estimated Budget</div>
                  <p className="text-gray-400 text-sm">
                    Total: {result.estimatedBudget.currency || 'USD'}{' '}
                    {result.estimatedBudget.total?.toLocaleString?.() || result.estimatedBudget.total}
                  </p>
                  {result.estimatedBudget.breakdown?.length > 0 && (
                    <ul className="text-sm text-gray-400 mt-2 space-y-1">
                      {result.estimatedBudget.breakdown.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.category}</span>
                          <span>
                            {result.estimatedBudget.currency || 'USD'} {item.amount?.toLocaleString?.() || item.amount}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {result.renderPrompts?.length > 0 && (
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Render Prompts</CardTitle>
              <CardDescription className="text-gray-400">Use these in your favorite AI render engine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.renderPrompts.map((renderPrompt, index) => (
                <pre key={index} className="rounded-lg border border-gray-800 bg-black/40 p-4 text-sm text-gray-200 whitespace-pre-wrap">{renderPrompt}</pre>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <section className="py-20 px-4 bg-gray-950" id="prompt-design-lab">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Describe It. Let AI Plan It.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tell the AI how you want the room to look and feel. It will return layout ideas, furniture plans, palettes, and next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-white">Your Vision</CardTitle>
              <CardDescription className="text-gray-400">Describe the vibe, function, and must-haves for your space.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={onGenerate}>
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-gray-200">Design Brief</Label>
                  <textarea
                    id="prompt"
                    rows={6}
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 text-gray-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Example: Create a playful kids room with hidden storage and a reading corner..."
                  />
                  <p className="text-xs text-gray-500">Tip: Mention colors, feelings, functions, or references you like.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-200">Room Type</Label>
                    <select
                      value={roomType}
                      onChange={(event) => setRoomType(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 text-gray-100 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {['living', 'bedroom', 'kitchen', 'bathroom', 'office', 'dining'].map((type) => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-gray-200">Preferred Style</Label>
                    <select
                      value={style}
                      onChange={(event) => setStyle(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-900 text-gray-100 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {['modern', 'minimalist', 'industrial', 'scandinavian', 'traditional', 'bohemian', 'rustic'].map((styleVariant) => (
                        <option key={styleVariant} value={styleVariant}>{styleVariant.charAt(0).toUpperCase() + styleVariant.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-200">Width (m)</Label>
                    <Input
                      type="number"
                      min="1"
                      step="0.1"
                      value={dimensions.width}
                      onChange={(event) => setDimensions({ ...dimensions, width: event.target.value })}
                      className="mt-2 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-200">Depth (m)</Label>
                    <Input
                      type="number"
                      min="1"
                      step="0.1"
                      value={dimensions.depth}
                      onChange={(event) => setDimensions({ ...dimensions, depth: event.target.value })}
                      className="mt-2 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-200">Height (m)</Label>
                    <Input
                      type="number"
                      min="2"
                      step="0.1"
                      value={dimensions.height}
                      onChange={(event) => setDimensions({ ...dimensions, height: event.target.value })}
                      className="mt-2 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-200">Budget (USD)</Label>
                    <Input
                      type="number"
                      min="500"
                      step="100"
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                      className="mt-2 bg-gray-900 border-gray-700 text-gray-100"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 glow-green-hover"
                  disabled={loading}
                >
                  {loading ? 'Thinking...' : 'Generate My Design Plan'}
                </Button>
                <p className="text-xs text-gray-500 text-center">Requires a Pro subscription. Uses AI to craft a personalized plan.</p>
              </form>
            </CardContent>
          </Card>

          <div>
            <Card className="glass-panel h-full">
              <CardHeader>
                <CardTitle className="text-white">AI Output</CardTitle>
                <CardDescription className="text-gray-400">You&apos;ll get layout logic, furniture ideas, palettes, and action steps.</CardDescription>
              </CardHeader>
              <CardContent>
                {!result && (
                  <div className="text-gray-400 text-sm space-y-3">
                    <p>Example questions you can ask:</p>
                    <ul className="space-y-2">
                      <li className="rounded-lg border border-gray-800 p-3 bg-gray-900/40">
                        “Turn my small studio into a multifunctional space with a murphy bed and hidden storage.”
                      </li>
                      <li className="rounded-lg border border-gray-800 p-3 bg-gray-900/40">
                        “Design a calming therapy office with natural textures and art display walls.”
                      </li>
                      <li className="rounded-lg border border-gray-800 p-3 bg-gray-900/40">
                        “Create a shared kids room with bunk beds, homework zone, and playful colors.”
                      </li>
                    </ul>
                  </div>
                )}
                {renderResult()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AiTools() {
  const tools = [
    { id: 1, name: 'Smart Wizard', description: 'Auto-generate room layouts based on dimensions and preferences', icon: Brain, features: ['Room size optimization', 'Furniture placement', 'Traffic flow analysis', 'Style matching'], badge: 'Most Popular', color: 'from-blue-600 to-purple-600' },
    { id: 2, name: 'Design Generator', description: 'Get AI-suggested furniture layouts and color schemes', icon: Wand2, features: ['Color palette generation', 'Furniture suggestions', 'Style coordination', 'Mood boards'], badge: 'New', color: 'from-green-600 to-teal-600' },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6"><div className="p-4 bg-green-600 rounded-full glow-green"><Sparkles className="h-12 w-12 text-white" /></div></div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6"><span className="text-green-400">AI-Powered</span><br /><span className="neon-underline">Design Tools</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Let artificial intelligence accelerate your design process with smart suggestions, automated layouts, and instant 3D modeling</p>
        </div>
      </section>

      <PromptDesignLab />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tools.map(tool => {
              const Icon = tool.icon
              return (
                <Card key={tool.id} className="glass-panel glow-green-hover transition-all duration-300 hover:scale-105 relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5`}></div>
                  {tool.badge && (<div className="absolute top-4 right-4"><Badge className="bg-green-600 text-white">{tool.badge}</Badge></div>)}
                  <CardHeader className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color}`}><Icon className="h-8 w-8 text-white" /></div>
                      <div><CardTitle className="text-2xl text-white">{tool.name}</CardTitle></div>
                    </div>
                    <CardDescription className="text-gray-400 text-lg">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Key Features:</h4>
                      <ul className="space-y-2">
                        {tool.features.map((feature, index) => (<li key={index} className="flex items-center gap-2 text-gray-300"><div className="w-2 h-2 bg-green-400 rounded-full"></div>{feature}</li>))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <a href="#create"><Button className="w-full bg-green-600 hover:bg-green-700 glow-green-hover">Try {tool.name} <ArrowRight className="ml-2 h-4 w-4" /></Button></a>
                      <Button variant="outline" className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">See AI Tools in Action</h2>
            <p className="text-xl text-gray-400">Watch how our AI transforms your design process</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">From Idea to Design in <span className="text-green-400">Seconds</span></h3>
              <div className="space-y-4">
                {[1,2,3].map((n) => (
                  <div className="flex items-start gap-4" key={n}>
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">{n}</div>
                    <div>
                      <h4 className="text-white font-semibold">{n === 1 ? 'Input Your Requirements' : n === 2 ? 'AI Analysis' : 'Instant Results'}</h4>
                      <p className="text-gray-400">{n === 1 ? 'Tell our AI about your space, style preferences, and functional needs' : n === 2 ? 'Our algorithms analyze thousands of design patterns and best practices' : 'Get multiple design options with furniture placement and color schemes'}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#create"><Button size="lg" className="bg-green-600 hover:bg-green-700 glow-green-hover">Start Designing with AI <Zap className="ml-2 h-5 w-5" /></Button></a>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg overflow-hidden" />
              <div className="absolute inset-0 flex items-center justify-center"><Button size="lg" className="bg-green-600 hover:bg-green-700 glow-green rounded-full w-16 h-16"><svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></Button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-green-900 to-green-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Design with AI?</h2>
          <p className="text-xl text-green-100 mb-8">Experience the future of interior design with our AI-powered tools</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#signup"><Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 text-lg px-8 py-4 glow-pulse">Start Free Trial <ArrowRight className="ml-2 h-5 w-5" /></Button></a>
            <a href="#create"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800 text-lg px-8 py-4">Try Demo</Button></a>
          </div>
        </div>
      </section>
    </div>
  )
}


