
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://govrxswzinijzacpyugp.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdnJ4c3d6aW5panphY3B5dWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY4OTg2MDUsImV4cCI6MjAwMjQ3NDYwNX0.m5XRiYyZMSvtRHVBP8MzBMgHAhb-z1dgF7AccSvte6Y"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;