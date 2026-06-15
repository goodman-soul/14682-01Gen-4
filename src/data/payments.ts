import { PaymentBill } from '@/types';

export const paymentBills: PaymentBill[] = [
  {
    id: 'b1',
    propertyId: 'p1',
    communityId: 'c1',
    type: 'property',
    amount: 580.00,
    status: 'unpaid',
    deadline: '2026-02-28',
    period: '2026年2月'
  },
  {
    id: 'b2',
    propertyId: 'p1',
    communityId: 'c1',
    type: 'water',
    amount: 82.50,
    status: 'unpaid',
    deadline: '2026-02-25',
    period: '2026年1月'
  },
  {
    id: 'b3',
    propertyId: 'p1',
    communityId: 'c1',
    type: 'electricity',
    amount: 156.80,
    status: 'paid',
    deadline: '2026-02-20',
    period: '2026年1月'
  },
  {
    id: 'b4',
    propertyId: 'p1',
    communityId: 'c1',
    type: 'gas',
    amount: 68.00,
    status: 'unpaid',
    deadline: '2026-02-22',
    period: '2026年1月'
  },
  {
    id: 'b5',
    propertyId: 'p2',
    communityId: 'c1',
    type: 'property',
    amount: 420.00,
    status: 'unpaid',
    deadline: '2026-02-28',
    period: '2026年2月'
  },
  {
    id: 'b6',
    propertyId: 'p2',
    communityId: 'c1',
    type: 'electricity',
    amount: 98.50,
    status: 'paid',
    deadline: '2026-02-20',
    period: '2026年1月'
  },
  {
    id: 'b7',
    propertyId: 'p3',
    communityId: 'c3',
    type: 'property',
    amount: 750.00,
    status: 'unpaid',
    deadline: '2026-02-28',
    period: '2026年2月'
  },
  {
    id: 'b8',
    propertyId: 'p3',
    communityId: 'c3',
    type: 'water',
    amount: 95.00,
    status: 'unpaid',
    deadline: '2026-02-25',
    period: '2026年1月'
  },
  {
    id: 'b9',
    propertyId: 'p3',
    communityId: 'c3',
    type: 'electricity',
    amount: 210.30,
    status: 'unpaid',
    deadline: '2026-02-20',
    period: '2026年1月'
  },
  {
    id: 'b10',
    propertyId: 'p3',
    communityId: 'c3',
    type: 'gas',
    amount: 120.00,
    status: 'paid',
    deadline: '2026-02-22',
    period: '2026年1月'
  },
  {
    id: 'b11',
    propertyId: 'p1',
    communityId: 'c1',
    type: 'property',
    amount: 580.00,
    status: 'paid',
    deadline: '2026-01-31',
    period: '2026年1月'
  },
  {
    id: 'b12',
    propertyId: 'p1',
    communityId: 'c1',
    type: 'water',
    amount: 75.20,
    status: 'paid',
    deadline: '2026-01-25',
    period: '2025年12月'
  }
];

export const getBillsByProperty = (propertyId: string): PaymentBill[] => {
  return paymentBills.filter(b => b.propertyId === propertyId);
};

export const getUnpaidBills = (propertyId: string): PaymentBill[] => {
  return paymentBills.filter(b => b.propertyId === propertyId && b.status === 'unpaid');
};
