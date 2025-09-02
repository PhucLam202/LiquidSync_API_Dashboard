import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in memory/database with expiration (5 minutes)
    // In production, use Redis or database
    // For now, we'll simulate the API
    console.log(`OTP for ${email}: ${otp}`)
    
    // TODO: Implement actual email sending logic
    // await sendEmailOtp(email, otp)
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully'
    })
    
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}