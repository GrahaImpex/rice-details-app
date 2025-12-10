import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://sagobctjwpnpmpcxxyut.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZ29iY3Rqd3BucG1wY3h4eXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMjUwNjYsImV4cCI6MjA2NTgwMTA2Nn0.h0HBrMVWKfK22vG-5zLTjrE8qopxypQFg3wWlMtQxKw"

export const supabase = createClient(supabaseUrl, supabaseKey)
