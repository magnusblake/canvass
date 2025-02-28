"use client"

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { createContext, useContext } from "react"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  )
}

const AuthContent = ({ children }) => {
  const { data: session } = useSession()

  const login = () => signIn()
  const logout = () => signOut()

  const user = session?.user || null

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}