import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tjrqzbktsmcrmuxymyxs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcnF6Ymt0c21jcm11eHlteXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyMDY2NDEsImV4cCI6MjAyNzc4MjY0MX0.8Bikjr5ArQFrzdy33czVcTkdpuWfhx5dDjFgGWwsDmA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})