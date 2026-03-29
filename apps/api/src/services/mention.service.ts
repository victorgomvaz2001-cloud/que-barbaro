import { Mention, MentionConfig } from '../models/Mention.model'
import type { IMention, IMentionCreate, IMentionUpdate, IMentionConfig } from '@falcanna/types'

/* ── Config helpers ─────────────────────────────────────────────────────── */

async function getConfig(): Promise<IMentionConfig> {
  let cfg = await MentionConfig.findOne().lean<IMentionConfig>()
  if (!cfg) {
    const created = await MentionConfig.create({ maxDisplay: 0 })
    cfg = created.toObject() as unknown as IMentionConfig
  }
  return cfg
}

async function updateConfig(data: Partial<IMentionConfig>): Promise<IMentionConfig> {
  const cfg = await MentionConfig.findOneAndUpdate(
    {},
    { $set: data },
    { upsert: true, new: true },
  ).lean<IMentionConfig>()
  return cfg!
}

/* ── Public: visible mentions, honoring maxDisplay ──────────────────────── */

async function getVisible(): Promise<IMention[]> {
  const cfg = await getConfig()
  const query = Mention.find({ visible: true }).sort({ order: 1, createdAt: 1 })
  if (cfg.maxDisplay > 0) query.limit(cfg.maxDisplay)
  return query.lean<IMention[]>()
}

/* ── Admin ──────────────────────────────────────────────────────────────── */

async function getAll(): Promise<IMention[]> {
  return Mention.find().sort({ order: 1, createdAt: 1 }).lean<IMention[]>()
}

async function create(data: IMentionCreate): Promise<IMention> {
  const mention = await Mention.create({
    name:    data.name,
    logoUrl: data.logoUrl,
    link:    data.link,
    order:   data.order ?? 0,
    visible: true,
  })
  return mention.toObject() as unknown as IMention
}

async function update(id: string, data: IMentionUpdate): Promise<IMention> {
  const mention = await Mention.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  ).lean<IMention>()
  if (!mention) throw new Error('Mention not found')
  return mention
}

async function remove(id: string): Promise<void> {
  const mention = await Mention.findByIdAndDelete(id)
  if (!mention) throw new Error('Mention not found')
}

export const mentionService = {
  getConfig,
  updateConfig,
  getVisible,
  getAll,
  create,
  update,
  remove,
}
