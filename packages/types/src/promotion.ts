export interface IPromotionLocalizedText {
  es: string
  en: string
}

export interface IPromotionButton {
  text: IPromotionLocalizedText
  url: string
  target: '_self' | '_blank'
}

export interface IPromotion {
  _id: string
  internalName: string
  title: IPromotionLocalizedText
  description: IPromotionLocalizedText
  backgroundImage: string
  button: IPromotionButton
  position: 'top' | 'bottom'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IPromotionCreate {
  internalName: string
  title: IPromotionLocalizedText
  description: IPromotionLocalizedText
  backgroundImage: string
  button: IPromotionButton
  position: 'top' | 'bottom'
}

export type IPromotionUpdate = Partial<IPromotionCreate>
