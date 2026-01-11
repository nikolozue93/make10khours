import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, color } = await req.json();
  const project = await prisma.project.create({
    data: { name, color },
  });
  return NextResponse.json(project);
}
