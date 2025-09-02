import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }
    
    // In production, verify OTP from database/Redis
    // For now, simulate verification
    // Accept any 6-digit OTP for demo purposes
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      )
    }
    
    console.log(`Verifying OTP ${otp} for ${email}`)
    
    // TODO: Implement actual OTP verification logic
    // const isValid = await verifyOtp(email, otp)
    const isValid = true // Simulate successful verification
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    })
    
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}