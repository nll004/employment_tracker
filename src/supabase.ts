import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://ilgjsnywzgmnopjvpnou.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsZ2pzbnl3emdtbm9wanZwbm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0NTUwODAsImV4cCI6MTk5ODAzMTA4MH0.9a2JP7YK7p4apKlfDbtXBicMKLQ8D2NhW8PSJFrpQxE')
