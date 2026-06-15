import { create } from 'zustand';
import { UserState, Property, Community } from '@/types';
import { communities, mockUserInfo, getCommunityById } from '@/data/communities';

interface AppStore extends UserState {
  login: () => void;
  logout: () => void;
  switchProperty: (propertyId: string) => void;
  switchCommunity: (communityId: string) => void;
}

const defaultCommunity: Community = communities[0];
const defaultProperty: Property | null = mockUserInfo.properties.find(p => p.isDefault) || null;

export const useAppStore = create<AppStore>((set, get) => ({
  isGuest: true,
  userInfo: null,
  currentCommunity: defaultCommunity,
  currentProperty: null,
  allCommunities: communities,

  login: () => {
    const user = mockUserInfo;
    const defaultProp = user.properties.find(p => p.isDefault) || user.properties[0];
    const community = getCommunityById(defaultProp.communityId);
    set({
      isGuest: false,
      userInfo: user,
      currentCommunity: community || defaultCommunity,
      currentProperty: defaultProp
    });
    console.log('[Auth] 用户登录成功', { user: user.name, property: defaultProp?.room });
  },

  logout: () => {
    set({
      isGuest: true,
      userInfo: null,
      currentProperty: null
    });
    console.log('[Auth] 用户已退出，切换为游客模式');
  },

  switchProperty: (propertyId: string) => {
    const state = get();
    if (!state.userInfo) return;
    const property = state.userInfo.properties.find(p => p.id === propertyId);
    if (property) {
      const community = getCommunityById(property.communityId);
      set({
        currentProperty: property,
        currentCommunity: community || state.currentCommunity
      });
      console.log('[Property] 切换房产成功', { building: property.building, room: property.room });
    }
  },

  switchCommunity: (communityId: string) => {
    const community = getCommunityById(communityId);
    if (community) {
      set({ currentCommunity: community });
      console.log('[Community] 切换小区成功', { name: community.name });
    }
  }
}));
