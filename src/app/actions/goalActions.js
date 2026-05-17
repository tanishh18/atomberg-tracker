'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitGoalSheet(formData) {
  const userId = formData.get('userId');
  const year = parseInt(formData.get('year'));
  const sheetId = formData.get('sheetId');
  const goalsStr = formData.get('goals');
  
  if (!userId || !year || !goalsStr) {
    return { error: 'Missing required fields' };
  }

  const goals = JSON.parse(goalsStr);

  try {
    if (sheetId) {
      // Update existing sheet
      await prisma.goal.deleteMany({ where: { sheetId } });
      await prisma.goalSheet.update({
        where: { id: sheetId },
        data: {
          status: 'Submitted',
          goals: {
            create: goals.map(g => ({
              title: g.title,
              thrustArea: g.thrustArea,
              uom: g.uom,
              target: g.target,
              weightage: g.weightage
            }))
          }
        }
      });
    } else {
      // Create new sheet
      await prisma.goalSheet.create({
        data: {
          userId,
          year,
          status: 'Submitted',
          goals: {
            create: goals.map(g => ({
              title: g.title,
              thrustArea: g.thrustArea,
              uom: g.uom,
              target: g.target,
              weightage: g.weightage
            }))
          }
        }
      });
    }

    revalidatePath('/dashboard/employee');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to submit goals' };
  }
}
