import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://zbvwfnnygyfcwwnrscoc.supabase.co'
const SUPABASE_KEY = 'sb_publishable_msqEFDNtv7DbvBkIsT5FZg_WvH7IbMw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
