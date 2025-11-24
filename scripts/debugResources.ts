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

async function debugResources() {
    console.log('Fetching resources...');

    const { data: resources, error } = await supabase
        .from('resources')
        .select('id, slug, type, title, status')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('❌ Error fetching resources:', error);
        return;
    }

    console.log(`✅ Found ${resources.length} resources total.`);

    const tips = resources.filter(r => r.type === 'tip' && r.status === 'published');
    console.log(`✅ Found ${tips.length} published tips.`);

    tips.forEach(t => console.log(`- [${t.type}] ${t.title} (${t.slug})`));
}

debugResources();
