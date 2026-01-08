import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.less'
import App from './App.tsx'
// 环境  useEffect执行次数
// development + StrictMode 2 次
// development（无 StrictMode）1 次
// production 1 次
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>
)
