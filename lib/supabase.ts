import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qkayjpcvocnfzozbbfwh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JhvP2uYxgfTS5TN66Ee5Hg_IYfvJPAu';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);