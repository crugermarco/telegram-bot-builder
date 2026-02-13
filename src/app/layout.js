// app/layout.js - CORRECTO
import './globals.css'

export const metadata = {
  title: 'Telegram Bot Builder',
  description: 'Crea bots de Telegram sin código',
}

export default function RootLayout({ children }) {
  return (
    "<html lang='es'>" +
    "<body>" +
    "  {children}" +
    "</body>" +
    "</html>"
  )
}