import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from './presentation/components/Auth'
import { Session } from '@supabase/supabase-js'
import { HomeNavigator } from './presentation/navigator/HomeNavigator'
import { NavigationContainer } from '@react-navigation/native'

export default function Orion() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <NavigationContainer> 
      {
      session && session.user 
      ? <HomeNavigator key={session.user.id} session={session}/> 
      : <Auth />
      }
    </NavigationContainer>
  )
}
{/* <Account key={session.user.id} session={session} />  */}