import { useState, useRef, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'

function IconSend({ size=18, color='currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
}
function IconBot({ size=18, color='currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/></svg>
}

const CANNED = {
  band7: `Here are the top 3 things you need to reach Band 7 overall:

1. **Fix your weakest module first.** Your overall band is the average of all 4 scores — one low module drags everything down. Identify it and dedicate 60% of your study time there.

2. **Master task achievement / coherence.** In Writing and Speaking, examiners penalise you most heavily for not answering the question fully. Always address every part of the task and link your ideas with clear discourse markers (Furthermore, However, This means that…).

3. **Expand your active vocabulary range.** Band 7 requires less common and idiomatic vocabulary used accurately. Learn words in collocations, not isolation — e.g., "draw a conclusion", "tackle a problem", "a significant rise".

Combine these with timed practice under real exam conditions and you will see a measurable jump within 6–8 weeks.`,

  speaking: `Here are the most effective techniques to improve your Fluency & Coherence score in IELTS Speaking:

**1. Use fillers strategically — not "um/uh"**
Replace hesitation sounds with thinking phrases: "That's an interesting question…", "Let me think about that for a second…" These sound natural and buy you time without penalising your score.

**2. Extend every answer with the WEE structure**
- **W**hat — state your point
- **E**xample — give a specific example
- **E**xplain — say why it matters
This prevents one-word answers and keeps you speaking fluently.

**3. Record yourself daily for 2 minutes**
Use Part 2 cue cards. Play it back and count unnatural pauses. Your target: no pause longer than 2 seconds.

**4. Link sentences consciously**
Practise connectors out loud: "Not only that, but…", "What's more…", "As a result of this…" until they feel automatic.

**5. Shadow native speakers**
Pick a podcast or YouTube video, pause every sentence and repeat it with the same rhythm and intonation. 15 minutes a day builds flow faster than any other method.`,

  task2: `The perfect paragraph structure for IELTS Writing Task 2 is **PEEL**:

**P — Point**
State your main idea in one clear sentence. This is your topic sentence.
"One significant advantage of remote work is the improvement in employee productivity."

**E — Explain**
Elaborate on why or how the point is true. Unpack the idea.
"When employees work from home, they avoid lengthy commutes and office distractions, allowing them to concentrate for longer uninterrupted periods."

**E — Evidence / Example**
Give a concrete example, statistic, or reference.
"For instance, a Stanford study found that remote workers were 13% more productive than their office-based counterparts."

**L — Link**
Connect back to the essay question or lead into the next paragraph.
"This demonstrates that flexible working arrangements can directly benefit both individuals and organisations."

**Rules:**
- One main idea per paragraph only
- Never start a new paragraph mid-argument
- Aim for 90–110 words per body paragraph
- Avoid bullet points inside the essay`,

  reading: `The most common traps in IELTS Reading True / False / Not Given questions:

**Trap 1 — Partial match (FALSE vs NOT GIVEN)**
The passage mentions the topic but doesn't confirm or contradict the statement → NOT GIVEN.
Students mark FALSE because "it doesn't say it's true." Wrong. FALSE means the passage actively contradicts the statement.

**Trap 2 — Extreme language**
Statement: "All scientists agree…" — Passage: "Most scientists agree…" → FALSE (not all = not all).
Watch for: all, never, always, only, every, completely.

**Trap 3 — Synonym substitution**
The statement paraphrases the passage with synonyms. Re-read the original carefully — the meaning may shift slightly.

**Trap 4 — Two-part statements**
"X is popular AND affordable." If the passage confirms X is popular but says nothing about price → NOT GIVEN (both parts must be confirmed).

**Golden rule:** If the information simply isn't in the passage, it's NOT GIVEN — even if common sense says it should be true.`,

  listening: `IELTS Listening distractors — how examiners use them and what to watch for:

**What is a distractor?**
A word or phrase that sounds like the correct answer but isn't — designed to catch students who aren't listening carefully.

**Types with examples:**

**1. Correction distractor**
Speaker says the answer, then corrects it:
"The meeting is on Wednesday… actually, no, it's been moved to Thursday."
→ Students write Wednesday. Correct answer: Thursday.

**2. Negation distractor**
"We do NOT recommend the hotel on Bridge Street."
→ Students write Bridge Street. Correct answer: avoid it.

**3. Synonym trap**
Question asks for a "cost" — speaker says "fee" or "charge". Students miss it because they're listening for the exact word.

**4. False start**
Speaker starts with one answer and changes: "You'll need your passport— sorry, your student ID card."

**Strategy:** Always keep writing until the speaker moves to a completely new topic. The real answer almost always comes after the distractor.`,

  vocab: `10 high-scoring academic phrases for IELTS Writing Task 2:

1. **"This has given rise to…"** — to show cause and effect
2. **"It is widely acknowledged that…"** — to introduce a well-known fact
3. **"The implications of this are far-reaching…"** — to discuss consequences
4. **"A growing body of evidence suggests…"** — to reference research
5. **"This issue is a subject of considerable debate…"** — for discussion essays
6. **"Proponents of this view argue that…"** — to present one side
7. **"Nevertheless, this perspective fails to consider…"** — to counter-argue
8. **"The root cause of this phenomenon is…"** — to analyse causes
9. **"In the long run, it is likely that…"** — for predictions/conclusions
10. **"Striking a balance between X and Y is therefore essential…"** — for balanced conclusions

**How to use them:** Don't memorise full sentences — learn the frame and slot in your topic. Examiners are trained to detect scripted phrases used out of context, which can lower your Lexical Resource score.`,

  upgrade: `**Achieving Band 8.5 from Band 6.0 — A Complete Roadmap**

Going from 6.0 to 8.5 is absolutely achievable, but it requires a structured approach across all four modules. Here's exactly what you need to do:

---

**What separates Band 6 from Band 8.5**

At Band 6 you communicate effectively but make frequent errors and use limited vocabulary. At Band 8.5 your language is fluent, flexible, and nearly error-free with only occasional slips.

---

**Writing (biggest score lever)**
- Task 2: Move beyond 5-paragraph templates. Develop nuanced arguments with counterarguments and concessions.
- Eliminate all subject-verb agreement errors, article mistakes, and run-on sentences.
- Target: 90%+ accurate complex sentences (relative clauses, conditionals, passive voice).
- Vocabulary: Replace common words — instead of "big" use "substantial / considerable / significant" depending on context.
- Practice: Write 2 essays per week, get them scored, analyse every examiner comment.

**Speaking**
- Record Part 2 answers (2 min) daily. Listen back critically.
- Aim for 0 unnatural pauses, natural self-corrections, and sophisticated hedging language.
- Use idiomatic expressions naturally — not memorised chunks.
- Band 8.5 Speaking requires near-native fluency and flexible grammar.

**Reading**
- Your speed must reach 250–300 words per minute with full comprehension.
- True/False/NG and matching headings are the hardest question types — drill these exclusively.
- Time yourself strictly: 20 minutes per passage maximum.

**Listening**
- At Band 8.5 you can afford to miss at most 2–3 questions out of 40.
- Focus on Section 3 & 4 (academic discussions) — these have the hardest distractors.
- Practise with fast speakers (BBC Radio 4, TED Talks).

---

**Realistic Timeline**
6.0 → 7.0: 8–10 weeks
7.0 → 8.0: 10–14 weeks
8.0 → 8.5: 12–20 weeks

Total from 6.0 to 8.5: approximately 6–9 months of consistent, structured study (1.5–2 hours/day).

---

**The 3 non-negotiables**
1. **Weekly scored feedback** — self-study without expert feedback plateaus quickly
2. **Active error log** — record every mistake, review weekly
3. **Immersion** — consume English content daily outside of study (podcasts, articles, films)

You can do this. The gap between 6.0 and 8.5 is not talent — it's method and consistency.`,

  limit: `I'm sorry, you've reached the daily free limit for AI responses.

Your limit resets in 24 hours. To continue without interruption, consider upgrading to a premium plan for unlimited access to the AI Tutor.`,
}

const QUICK_PROMPTS = [
  { label: 'Band 7 tips',           key: 'band7' },
  { label: 'Speaking Fluency',      key: 'speaking' },
  { label: 'Task 2 structure',      key: 'task2' },
  { label: 'Reading traps',         key: 'reading' },
  { label: 'Listening distractors', key: 'listening' },
  { label: 'Vocabulary boost',      key: 'vocab' },
  { label: '6.0 → 8.5 Roadmap',    key: 'upgrade', accent: true },
]

function isUpgradeQuestion(text) {
  return /\b(8\.5|8\.0|band\s*8|from\s*6|6\s*to\s*8|achieve\s*8|reach\s*8|possible.*8|achiev)/i.test(text)
}

// Render **bold** and line breaks
function renderText(text) {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)
    return <span key={i}>{rendered}{i < arr.length - 1 && <br />}</span>
  })
}

// Streaming text hook
function useTypewriter() {
  const [streamingId, setStreamingId]   = useState(null)
  const [streamedText, setStreamedText] = useState('')
  const rafRef = useRef(null)

  const startStream = (id, fullText, onDone) => {
    setStreamingId(id)
    setStreamedText('')
    let i = 0
    // Variable speed: faster for spaces, slower for punctuation
    const tick = () => {
      if (i >= fullText.length) {
        setStreamingId(null)
        onDone()
        return
      }
      const ch = fullText[i]
      i++
      setStreamedText(fullText.slice(0, i))
      // Speed: punctuation pause, normal chars fast
      const delay = /[.!?]/.test(ch) ? 40 : /[,;:]/.test(ch) ? 20 : /\n/.test(ch) ? 30 : 8
      rafRef.current = setTimeout(tick, delay)
    }
    tick()
  }

  useEffect(() => () => clearTimeout(rafRef.current), [])

  return { streamingId, streamedText, startStream }
}

export default function Assistant() {
  const [messages, setMessages]   = useState([
    { id: 0, role: 'assistant', text: "Hey! I'm your IELTS AI tutor. Ask me anything about the exam — strategies, grammar, vocabulary, how to improve your band score, or practice questions. What do you want to work on today?" }
  ])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [streaming, setStreaming] = useState(false)
  const { streamingId, streamedText, startStream } = useTypewriter()
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)
  const idRef     = useRef(1)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, streamedText])

  const send = (text, cannedKey) => {
    const msg = text || input.trim()
    if (!msg || loading || streaming) return
    setInput('')

    const userMsg = { id: idRef.current++, role: 'user', text: msg }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    const key = cannedKey || (isUpgradeQuestion(msg) ? 'upgrade' : 'limit')
    const reply = CANNED[key]
    const newId = idRef.current++

    // Think for 2s, then stream
    setTimeout(() => {
      setLoading(false)
      setStreaming(true)
      setMessages(prev => [...prev, { id: newId, role: 'assistant', text: '' }])
      startStream(newId, reply, () => {
        setStreaming(false)
        setMessages(prev => prev.map(m => m.id === newId ? { ...m, text: reply } : m))
        inputRef.current?.focus()
      })
    }, 2000)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '24px 32px 0', flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI TUTOR</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-dim)', border: '1px solid rgba(124,92,252,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBot size={22} color="var(--accent)" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em' }}>
                IELTS <span style={{ color: 'var(--accent)' }}>Assistant</span>
              </h1>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Powered by Gemini 1.5 Flash · Expert IELTS tutor</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p.label} onClick={() => send(p.label, p.key)} disabled={loading || streaming}
                style={{
                  padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                  background: p.accent ? 'var(--accent-dim)' : 'var(--bg-card)',
                  border: `1px solid ${p.accent ? 'rgba(124,92,252,0.5)' : 'var(--border)'}`,
                  color: p.accent ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: loading || streaming ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                  opacity: loading || streaming ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!loading && !streaming) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = p.accent ? 'rgba(124,92,252,0.5)' : 'var(--border)'; e.currentTarget.style.color = p.accent ? 'var(--accent)' : 'var(--text-secondary)' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 32px' }}>
          {messages.map((m) => {
            const isStreaming = m.id === streamingId
            const displayText = isStreaming ? streamedText : m.text

            return (
              <div key={m.id} style={{
                display: 'flex', gap: 12, marginBottom: 20,
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}>
                {m.role === 'assistant' && (
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid rgba(124,92,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <IconBot size={16} color="var(--accent)" />
                  </div>
                )}
                <div style={{
                  maxWidth: '72%', padding: '12px 16px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                  fontSize: 14, lineHeight: 1.7,
                  color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                }}>
                  {renderText(displayText)}
                  {isStreaming && (
                    <span style={{
                      display: 'inline-block', width: 2, height: '1em',
                      background: 'var(--accent)', marginLeft: 2,
                      animation: 'blink 0.7s step-end infinite', verticalAlign: 'text-bottom'
                    }} />
                  )}
                </div>
              </div>
            )
          })}

          {/* Thinking dots */}
          {loading && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid rgba(124,92,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconBot size={16} color="var(--accent)" />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: `bounce 1s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <style>{`
            @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }
            @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
          `}</style>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 32px 24px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about IELTS... (Enter to send, Shift+Enter for new line)"
              rows={1}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 14,
                border: '1px solid var(--border-soft)', background: 'var(--bg-card)',
                color: 'var(--text-primary)', fontSize: 14, resize: 'none',
                fontFamily: 'var(--font-body)', lineHeight: 1.5, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-soft)'}
            />
            <button onClick={() => send()} disabled={loading || streaming || !input.trim()} style={{
              width: 44, height: 44, borderRadius: 12, border: 'none',
              background: input.trim() && !loading && !streaming ? 'var(--accent)' : 'var(--border-soft)',
              cursor: input.trim() && !loading && !streaming ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}>
              <IconSend size={16} color="#fff" />
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            AI can make mistakes — always verify band descriptors with official IELTS materials
          </div>
        </div>
      </main>
    </div>
  )
}
