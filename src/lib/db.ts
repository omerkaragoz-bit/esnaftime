import { neon } from '@neondatabase/serverless';

export function getDb() {
  const sql = neon(process.env.DATABASE_URL || "postgresql://neondb_owner:npg_SuEx5J4CneYT@ep-sweet-tooth-abk6ih7c.eu-west-2.aws.neon.tech/neondb?sslmode=require");
  return sql;
}

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  role: 'student' | 'merchant' | 'new';
  verified: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Merchant = {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  discount_percent: number;
  rating: number;
  review_count: number;
  verified: boolean;
  logo_url: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Visit = {
  id: string;
  student_id: string;
  merchant_id: string;
  points_earned: number;
  created_at: string;
};

export type Review = {
  id: string;
  student_id: string;
  merchant_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
};

export type LoyaltyPoints = {
  id: string;
  student_id: string;
  merchant_id: string;
  total_visits: number;
  total_points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
  updated_at: string;
};