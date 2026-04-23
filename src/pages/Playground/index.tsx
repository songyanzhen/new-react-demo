import { useState, useRef, useEffect } from 'react'

/**
 * 代码实验室 - Playground
 * 
 * 包含两个模式：
 * 1. React 组件测试 - 用于测试 React、JS、CSS
 * 2. HTML/JS 实时预览 - 用于调试原生 HTML+JS+CSS
 */
export function Playground() {
  const [mode, setMode] = useState<'react' | 'html'>('react')

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="mx-auto max-w-6xl">
        {/* 标题区域 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              🧪 代码实验室
            </h1>
            <p className="mt-1 text-slate-400">
              自由测试 React、JavaScript、CSS、HTML 代码
            </p>
          </div>
          
          {/* 模式切换 */}
          <div className="flex rounded-lg border border-dark-600 bg-dark-800 p-1">
            <button
              onClick={() => setMode('react')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === 'react'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              React 组件
            </button>
            <button
              onClick={() => setMode('html')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === 'html'
                  ? 'bg-green-500 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              HTML/JS 预览
            </button>
          </div>
        </div>

        {/* 模式内容 */}
        {mode === 'react' ? <ReactPlayground /> : <HtmlPlayground />}
      </div>
    </div>
  )
}

// ==================== React 组件测试模式 ====================
function ReactPlayground() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  return (
    <div className="space-y-6">
      {/* 计数器示例 */}
      <section className="rounded-xl border border-dark-600 bg-dark-800/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-200">
          计数器示例
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCount(c => c - 1)}
            className="rounded-lg bg-red-500/20 px-4 py-2 text-red-300 transition hover:bg-red-500/30"
          >
            -1
          </button>
          <span className="min-w-[3rem] text-center text-2xl font-bold text-slate-100">
            {count}
          </span>
          <button
            onClick={() => setCount(c => c + 1)}
            className="rounded-lg bg-green-500/20 px-4 py-2 text-green-300 transition hover:bg-green-500/30"
          >
            +1
          </button>
          <button
            onClick={() => setCount(0)}
            className="ml-4 rounded-lg bg-dark-700 px-4 py-2 text-slate-400 transition hover:bg-dark-600"
          >
            重置
          </button>
        </div>
      </section>

      {/* 输入绑定 */}
      <section className="rounded-xl border border-dark-600 bg-dark-800/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-200">
          输入绑定示例
        </h2>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入一些文字..."
          className="w-full rounded-lg border border-dark-600 bg-dark-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500"
        />
        <p className="mt-3 text-slate-400">
          你输入了：<span className="text-blue-400">{text || '（空）'}</span>
        </p>
      </section>

      {/* CSS 样式实验 */}
      <section className="rounded-xl border border-dark-600 bg-dark-800/50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-200">
          CSS 样式实验
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white shadow-lg">
            渐变
          </div>
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-yellow-500/50 bg-yellow-500/10 font-bold text-yellow-400">
            边框
          </div>
          <div className="flex h-24 items-center justify-center rounded-lg bg-dark-700 font-bold text-slate-300 shadow-inner transition hover:scale-105 hover:bg-dark-600">
            悬停
          </div>
        </div>
      </section>

      {/* 空白区域 */}
      <section className="rounded-xl border-2 border-dashed border-dark-600 bg-dark-800/30 p-6">
        <h2 className="mb-4 text-xl font-semibold text-slate-200">
          🎨 你的代码在这里
        </h2>
        <p className="text-slate-500">
          修改 src/pages/Playground/index.tsx 开始编写你自己的组件...
        </p>
      </section>
    </div>
  )
}

// ==================== HTML/JS 实时预览模式 ====================
const DEFAULT_HTML_CODE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试页面</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    h1 {
      color: #333;
      margin-top: 0;
    }
    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
    }
    #output {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      min-height: 50px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎉 欢迎使用 HTML/JS 实验室</h1>
    <p>在左侧编辑代码，右侧会实时预览效果。</p>
    <button onclick="handleClick()">点击我</button>
    <div id="output"></div>
  </div>

  <script>
    let count = 0;
    
    function handleClick() {
      count++;
      const output = document.getElementById('output');
      output.innerHTML = '<strong>你点击了 ' + count + ' 次！</strong>';
      
      // 添加一些动画效果
      output.style.opacity = '0';
      setTimeout(() => {
        output.style.transition = 'opacity 0.3s';
        output.style.opacity = '1';
      }, 50);
    }
    
    console.log('页面加载完成！');
  </script>
</body>
</html>`

function HtmlPlayground() {
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML_CODE)
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  const [previewHtml, setPreviewHtml] = useState(DEFAULT_HTML_CODE)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 代码变化时防抖更新预览
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(htmlCode)
    }, 300)
    return () => clearTimeout(timer)
  }, [htmlCode])

  // 强制刷新 iframe（通过改变 key）
  const forceRefresh = () => {
    setPreviewHtml('')
    setTimeout(() => setPreviewHtml(htmlCode), 50)
  }

  // 格式化代码（简单缩进）
  const formatCode = () => {
    // 简单的格式化，实际项目中可以使用 prettier
    alert('格式化功能可以使用 prettier 等库实现')
  }

  // 清空代码
  const clearCode = () => {
    if (confirm('确定要清空所有代码吗？')) {
      setHtmlCode('')
    }
  }

  // 重置为默认代码
  const resetCode = () => {
    setHtmlCode(DEFAULT_HTML_CODE)
  }

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dark-600 bg-dark-800 p-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">编辑</span>
          <button
            onClick={formatCode}
            className="rounded bg-dark-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-dark-600"
          >
            格式化
          </button>
          <button
            onClick={clearCode}
            className="rounded bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/20"
          >
            清空
          </button>
          <button
            onClick={resetCode}
            className="rounded bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400 transition hover:bg-blue-500/20"
          >
            重置示例
          </button>
        </div>
        
        {/* 移动端标签切换 */}
        <div className="flex rounded border border-dark-600 bg-dark-900 sm:hidden">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs ${activeTab === 'code' ? 'bg-green-500 text-white' : 'text-slate-400'}`}
          >
            代码
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs ${activeTab === 'preview' ? 'bg-green-500 text-white' : 'text-slate-400'}`}
          >
            预览
          </button>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 代码编辑器 */}
        <div className={`${activeTab !== 'code' ? 'hidden sm:block' : ''}`}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">HTML + CSS + JavaScript</span>
            <span className="text-xs text-slate-500">{htmlCode.length} 字符</span>
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="<!DOCTYPE html>
<html>
<head>
  <style>
    /* 你的 CSS */
  </style>
</head>
<body>
  <!-- 你的 HTML -->
  <script>
    // 你的 JavaScript
  </script>
</body>
</html>"
            className="h-[500px] w-full resize-none rounded-lg border border-dark-600 bg-dark-900 p-4 font-mono text-sm leading-relaxed text-slate-300 outline-none transition focus:border-green-500"
            spellCheck={false}
          />
        </div>

        {/* 实时预览 */}
        <div className={`${activeTab !== 'preview' ? 'hidden sm:block' : ''}`}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">实时预览</span>
            <button
              onClick={forceRefresh}
              className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-400 transition hover:bg-green-500/20"
            >
              ⟳ 刷新
            </button>
          </div>
          <div className="h-[500px] overflow-hidden rounded-lg border border-dark-600 bg-white">
            <iframe
              ref={iframeRef}
              title="HTML Preview"
              className="h-full w-full"
              sandbox="allow-scripts allow-modals allow-same-origin"
              srcDoc={previewHtml}
            />
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="rounded-lg border border-dark-600 bg-dark-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-300">💡 使用提示</h3>
        <ul className="space-y-1 text-xs text-slate-500">
          <li>• 左侧输入完整的 HTML 代码（包含 &lt;!DOCTYPE html&gt;）</li>
          <li>• 右侧会自动实时预览，每输入 300ms 后自动更新</li>
          <li>• 支持内联 &lt;style&gt; 和 &lt;script&gt; 标签</li>
          <li>• 可以使用 console.log()，在浏览器开发者工具中查看输出</li>
          <li>• 代码运行在隔离的 iframe 中，不会影响主应用</li>
        </ul>
      </div>
    </div>
  )
}

export default Playground
