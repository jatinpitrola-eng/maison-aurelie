import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const bodySchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = bodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const existing = await db.preorder.findUnique({
      where: { email: parsed.data.email },
    })

    if (existing) {
      return NextResponse.json({ ok: true, message: "You're already on the list — see you in March." })
    }

    await db.preorder.create({
      data: { email: parsed.data.email },
    })

    return NextResponse.json({
      ok: true,
      message: 'Reserved. Your AURA X1 is waiting — check your inbox.',
    })
  } catch (err) {
    console.error('[preorder] failed:', err)
    return NextResponse.json({ error: 'Server error — please try again.' }, { status: 500 })
  }
}
