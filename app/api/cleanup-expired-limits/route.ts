import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    // Verify this is being called from a cron job or internal system
    // In production, you should add proper authentication/authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Call the cleanup function
    const { data: rowsUpdated, error } = await supabaseAdmin.rpc('cleanup_expired_grandfathered_limits')

    if (error) {
      console.error('Error cleaning up expired grandfathered limits:', error)
      return NextResponse.json(
        { error: 'Failed to cleanup expired limits' },
        { status: 500 }
      )
    }

    console.log(`Cleaned up ${rowsUpdated} expired grandfathered limits`)

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${rowsUpdated} expired grandfathered limits`,
      rowsUpdated
    })
  } catch (error) {
    console.error('Cleanup expired limits error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow GET for health checks
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'Cleanup expired limits endpoint is healthy' 
  })
}
