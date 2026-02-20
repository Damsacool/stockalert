import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pucerhyphyzxmlprpspk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1Y2VyaHlwaHl6eG1scHJwc3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTU0MTcsImV4cCI6MjA4Njk5MTQxN30.pT-_86bhwdumxILHlRs_lfEoJXdWu4SEKo_m0Nx1PjI';

// Check BEFORE creating client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables!');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey ? 'EXISTS' : 'MISSING');
  throw new Error('Missing Supabase environment variables! Check your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    const { error } = await supabase
      .from('products')
      .select('count');
    
    if (error) {
      console.error('Supabase test FAILED:', error);
      return false;
    }
    
    console.log('Supabase test SUCCESS!');
    return true;
  } catch (err) {
    console.error('Supabase test ERROR:', err);
    return false;
  }
};