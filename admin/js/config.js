import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Projet Supabase "MoovEnsemble" (réservations aux séances).
// L'ancien projet "conta" (zbvwfnnygyfcwwnrscoc) est abandonné.
const SUPABASE_URL = 'https://djjaxrlsgulaqawzskbu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_CPnHYFaVVnrcvhV6nUDeAw_8eDVVlKJ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
