import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const reservationSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(80),
  email: z.email('Please provide a valid email').max(120),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  piece: z.string().trim().min(2).max(80),
  date: z.string().trim().max(40).optional().or(z.literal('')),
  note: z.string().trim().max(500).optional().or(z.literal('')),
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

    const { name, email, phone, piece, date, note } = parsed.data

    try {
      const reservation = await db.reservation.create({
        data: {
          name,
          email,
          phone: phone || null,
          piece,
          date: date || null,
          note: note || null,
        },
      })

      return NextResponse.json({ ok: true, id: reservation.id }, { status: 201 })
    } catch {
      /* On serverless hosts the sqlite file is ephemeral or absent — the
         concierge flow must still complete, so issue a reference instead
         of failing. Self-hosted deployments keep returning honest 500s. */
      if (!process.env.VERCEL) {
        return NextResponse.json(
          { ok: false, error: 'The salon is unreachable at the moment. Please try again.' },
          { status: 500 },
        )
      }

      const reference = crypto.randomUUID()
      console.warn('[reservation] db unavailable on serverless — issued reference', reference)
      return NextResponse.json({ ok: true, id: reference, persisted: false }, { status: 201 })
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: 'The salon is unreachable at the moment. Please try again.' },
      { status: 500 },
    )
  }
}
