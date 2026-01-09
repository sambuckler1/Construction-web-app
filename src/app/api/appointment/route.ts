import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      email,
      address,
      dumpsterSize,
      date,
      notes,
    } = body ?? {};

    if (!name || !phone || !address || !dumpsterSize || !date) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: "Woodstock Dumpster <onboarding@resend.dev>",
      to: ["sambuckler06@gmail.com"],
      subject: "New dumpster appointment request",
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : "",
        `Address: ${address}`,
        `Dumpster size: ${dumpsterSize}`,
        `Preferred date: ${date}`,
        "",
        "Project details:",
        notes || "(none provided)",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in /api/appointment:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}



