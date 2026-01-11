import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { startOfDay, subDays, isSameDay, parseISO } from 'date-fns';

const prisma = new PrismaClient();

export async function GET() {
  // 1. Fetch all data
  const sessions = await prisma.session.findMany({
    include: { project: true },
    orderBy: { date: 'desc' },
  });

  const projects = await prisma.project.findMany();

  // 2. Calculate Basic Metrics
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalTasks = sessions.length;

  // 3. Calculate Streak (Real Logic)
  // Get unique dates where work was done
  const workDates = Array.from(new Set(sessions.map(s => 
    new Date(s.date).toISOString().split('T')[0]
  ))).sort().reverse(); // Newest first

  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If we worked today, start counting. If not, check if we worked yesterday.
  let currentCheck = workDates[0] === today ? today : (workDates[0] === yesterday ? yesterday : null);

  if (currentCheck) {
    streak = 1;
    // Check consecutive days backwards
    for (let i = 0; i < workDates.length - 1; i++) {
      const curr = new Date(workDates[i]);
      const prev = new Date(workDates[i+1]);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  // 4. Calculate Daily Goal Progress (e.g. Goal = 4 hours/day)
  const todaysSessions = sessions.filter(s => isSameDay(new Date(s.date), new Date()));
  const minutesToday = todaysSessions.reduce((acc, s) => acc + s.duration, 0);
  const dailyGoalMinutes = 4 * 60; // 4 hours
  const completionRate = Math.min(Math.round((minutesToday / dailyGoalMinutes) * 100), 100);

  // 5. Project Distribution
  const projectDistribution = projects.map(p => ({
    name: p.name,
    color: p.color,
    value: sessions.filter(s => s.projectId === p.id).reduce((acc, s) => acc + s.duration, 0)
  })).filter(p => p.value > 0);

  return NextResponse.json({
    sessions,
    projects,
    metrics: {
      totalHours: (totalMinutes / 60).toFixed(1),
      totalTasks,
      streak,
      completionRate: `${completionRate}% (of 4h)` // Dynamic
    },
    charts: {
      projectDistribution
    }
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  
  // Handle "Create Project" or "Log Session"
  if (body.type === 'CREATE_PROJECT') {
    const project = await prisma.project.create({
      data: { name: body.name, color: body.color },
    });
    return NextResponse.json(project);
  } else {
    const { projectId, description, duration, date } = body;
    const session = await prisma.session.create({
      data: {
        projectId,
        description,
        duration: parseInt(duration),
        date: new Date(date),
      },
    });
    return NextResponse.json(session);
  }
}