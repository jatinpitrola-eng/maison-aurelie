import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const reservationSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80),
  email: z.email('Please provide a valid email').max(120),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  piece: z.string().trim().min(2).max(80),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = reservationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'Please check your details and try again.' },
        { status: 400 },
      )
    }

    const { name, email, phone, piece } = parsed.data

    const reservation = await db.reservation.create({
      data: {
        name,
        email,
        phone: phone || null,
        piece,
      },
    })

    return NextResponse.json({ ok: true, id: reservation.id }, { status: 201 })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'The salon is unreachable at the moment. Please try again.' },
      { status: 500 },
    )
  }
}
