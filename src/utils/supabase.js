import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables!');
}

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        id: 999,
        name: 'TEST PRODUCT',
        stock: 5,
        minStock: 2,
        costPrice: 1000,
        sellingPrice: 2000,
        images: []
      }])
      .select();
    
    if (error) {
      console.error(' Supabase test FAILED:', error);
      return false;
    }
    
    console.log('Supabase test SUCCESS!', data);
    return true;
  } catch (err) {
    console.error('Supabase test ERROR:', err);
    return false;
  }
};