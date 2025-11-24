import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabaseUrl);

    try {
        const { data, error } = await supabase.from('articles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Error fetching articles:', error);
        } else {
            console.log('Successfully connected to articles table. Count:', data);
        }
    } catch (err) {
        console.error('Exception fetching articles:', err);
    }

    try {
        const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
        if (error) {
            console.error('Error fetching users:', error);
        } else {
            console.log('Successfully connected to auth admin. Users found:', data.users.length);
        }
    } catch (err) {
        console.error('Exception fetching users:', err);
    }
}

testConnection();
