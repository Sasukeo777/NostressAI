import { config } from 'dotenv';
import { getSupabaseServiceClient } from '../lib/supabaseClient';

config({ path: '.env.local' });

async function main() {
    const supabase = getSupabaseServiceClient();

    const { error } = await supabase
        .from('articles')
        .delete()
        .ilike('slug', 'dummy-article-%');

    if (error) {
        console.error('Failed to delete dummy articles:', error.message);
        process.exit(1);
    }

    console.log('Successfully deleted dummy articles.');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
