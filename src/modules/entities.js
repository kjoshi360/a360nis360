const express = require('express');
const { z } = require('zod');
const { prisma } = require('../lib/prisma');

const router = express.Router();

const createEntitySchema = z.object({
  name: z.string().min(1),
  countryCode: z.string().length(2),
  baseCurrency: z.string().length(3),
  financialYearStart: z.string().date(),
  gstRegistrationType: z.enum(['regular', 'composition']).optional(),
  gstin: z.string().length(15).optional(),
  pan: z.string().length(10).optional()
});

router.post('/', async (req, res) => {
  const parsed = createEntitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const entity = await prisma.entity.create({
    data: {
      ...parsed.data,
      financialYearStart: new Date(parsed.data.financialYearStart)
    }
  });

  return res.status(201).json(entity);
});

router.get('/', async (_req, res) => {
  const entities = await prisma.entity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return res.json({ data: entities });
});

module.exports = { entityRouter: router };
