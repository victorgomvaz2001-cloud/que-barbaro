import { Promotion } from '../models/Promotion.model'
import type { IPromotion, IPromotionCreate, IPromotionUpdate } from '@falcanna/types'

async function getActive(): Promise<IPromotion | null> {
  return Promotion.findOne({ isActive: true }).lean<IPromotion>()
}

async function getAll(): Promise<IPromotion[]> {
  return Promotion.find().sort({ createdAt: -1 }).lean<IPromotion[]>()
}

async function create(data: IPromotionCreate): Promise<IPromotion> {
  const promotion = await Promotion.create({
    internalName:    data.internalName,
    title:           data.title,
    description:     data.description,
    backgroundImage: data.backgroundImage,
    button:          data.button,
    position:        data.position ?? 'top',
    isActive:        false,
  })
  return promotion.toObject() as unknown as IPromotion
}

async function update(id: string, data: IPromotionUpdate): Promise<IPromotion> {
  const promotion = await Promotion.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true },
  ).lean<IPromotion>()
  if (!promotion) throw new Error('Promotion not found')
  return promotion
}

async function activate(id: string): Promise<IPromotion> {
  // Deactivate all, then activate the target - atomically with two ops
  await Promotion.updateMany({ isActive: true }, { $set: { isActive: false } })
  const promotion = await Promotion.findByIdAndUpdate(
    id,
    { $set: { isActive: true } },
    { new: true },
  ).lean<IPromotion>()
  if (!promotion) throw new Error('Promotion not found')
  return promotion
}

async function deactivate(id: string): Promise<IPromotion> {
  const promotion = await Promotion.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true },
  ).lean<IPromotion>()
  if (!promotion) throw new Error('Promotion not found')
  return promotion
}

async function remove(id: string): Promise<void> {
  const promotion = await Promotion.findById(id)
  if (!promotion) throw new Error('Promotion not found')
  if (promotion.isActive) throw new Error('Cannot delete an active promotion')
  await promotion.deleteOne()
}

async function bulkDelete(ids: string[]): Promise<void> {
  await Promotion.deleteMany({ _id: { $in: ids }, isActive: false })
}

export const promotionService = {
  getActive,
  getAll,
  create,
  update,
  activate,
  deactivate,
  remove,
  bulkDelete,
}
