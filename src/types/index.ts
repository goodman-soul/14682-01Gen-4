export interface Community {
  id: string;
  name: string;
  address: string;
  propertyPhone: string;
  buildings: string[];
  quickEntries: QuickEntry[];
  serviceMenu: ServiceMenuItem[];
  bannerImage: string;
}

export interface QuickEntry {
  id: string;
  name: string;
  icon: string;
  pagePath: string;
  requireAuth: boolean;
}

export interface ServiceMenuItem {
  id: string;
  name: string;
  icon: string;
  pagePath: string;
  category: 'life' | 'property' | 'travel';
  requireAuth: boolean;
}

export interface Property {
  id: string;
  communityId: string;
  communityName: string;
  building: string;
  room: string;
  owner: string;
  isDefault: boolean;
}

export interface Notice {
  id: string;
  title: string;
  communityId: string;
  type: 'notice' | 'activity' | 'warning';
  content: string;
  publishTime: string;
  isPublic: boolean;
  buildingScope?: string[];
}

export interface RepairOrder {
  id: string;
  propertyId: string;
  communityId: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createTime: string;
  type: string;
}

export interface PaymentBill {
  id: string;
  propertyId: string;
  communityId: string;
  type: 'property' | 'water' | 'electricity' | 'gas';
  amount: number;
  status: 'unpaid' | 'paid';
  deadline: string;
  period: string;
}

export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  isGuest: boolean;
  properties: Property[];
}

export type UserState = {
  isGuest: boolean;
  userInfo: UserInfo | null;
  currentCommunity: Community | null;
  currentProperty: Property | null;
  allCommunities: Community[];
};
