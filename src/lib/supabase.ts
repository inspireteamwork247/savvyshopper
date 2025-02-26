
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://laeupgwngrunaaxvkokf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZXVwZ3duZ3J1bmFheHZrb2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NDUwODMsImV4cCI6MjA1NTIyMTA4M30.p5vE9xpsbDaF-4UFSfI_mI6mBoDygGVMDZkOKafMUXw';

export const supabase = createClient(supabaseUrl, supabaseKey);
