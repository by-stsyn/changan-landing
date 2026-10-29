/*
  # Create leads table for Changan Центр Купчино landing

  ## Summary
  Creates a leads table to store all form submissions from the landing page.

  ## New Tables
  - `leads`
    - `id` (uuid, primary key)
    - `name` (text) - Lead's name
    - `phone` (text) - Lead's phone number
    - `car_title` (text, nullable) - Selected car title
    - `car_id` (text, nullable) - Selected car ID from feed
    - `source` (text, nullable) - UTM source
    - `utm_medium` (text, nullable)
    - `utm_campaign` (text, nullable)
    - `utm_term` (text, nullable)
    - `form_type` (text) - Which form was used (hero, catalog, cta, etc.)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Insert policy for anonymous users (anyone can submit a lead)
  - Select policy only for authenticated service role (admin access)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  car_title text DEFAULT '',
  car_id text DEFAULT '',
  source text DEFAULT '',
  utm_medium text DEFAULT '',
  utm_campaign text DEFAULT '',
  utm_term text DEFAULT '',
  form_type text DEFAULT 'unknown',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a lead"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
