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

async function verifyConnection() {
    console.log('Verifying Supabase connection...');

    try {
        const { data, error } = await supabase.from('articles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('❌ Connection failed:', JSON.stringify(error, null, 2));
        } else {
            console.log('✅ Connection successful! Articles table accessible.');
        }
    } catch (err) {
        console.error('❌ Exception:', err);
    }
}

verifyConnection();
