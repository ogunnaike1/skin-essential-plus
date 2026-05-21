import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'bestsellers' | 'new_arrivals' | null (all)
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 100;

    const client = getClient();
    let query = client.from('products').select('*');

    if (type === 'bestsellers') {
      query = query.eq('is_bestseller', true);
    } else if (type === 'new_arrivals') {
      query = query.eq('is_new_arrival', true);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase products error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
