import { useMemo, useState } from 'react'

function highlightArduino(code: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(/(\/\/.*)$/gm, '<span class="tok-cm">$1</span>')
    .replace(
      /\b(const|int|void|float|bool|true|false|HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|if|else|return|include|define)\b/g,
      '<span class="tok-kw">$1</span>',
    )
    .replace(
      /\b(Serial|pinMode|digitalRead|digitalWrite|analogRead|analogWrite|delay|map|tone|noTone|abs|isnan)\b/g,
      '<span class="tok-fn">$1</span>',
    )
    .replace(/(&quot;.*?&quot;|".*?")/g, '<span class="tok-str">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-num">$1</span>')
}

export function CodeBlock({
  code,
  title = 'Arduino sketch',
}: {
  code: string
  title?: string
}) {
  const [copied, setCopied] = useState(false)
  const html = useMemo(() => highlightArduino(code), [code])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{title}</span>
        <button type="button" className="copy-btn" onClick={copy}>
          {copied ? 'U kopjua ✓' : 'Kopjo kodin'}
        </button>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  )
}
