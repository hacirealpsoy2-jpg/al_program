/*
  # Çalışma Takip Sistemi - Veritabanı Şeması

  1. Yeni Tablolar
    - `study_schedule` - 6 aylık TYT-AYT İngilizce ve Python programı
      - `id` (uuid, primary key)
      - `week_number` (integer) - Hafta numarası (1-24)
      - `day_number` (integer) - Gün numarası (1-7)
      - `subject` (text) - Konu (İngilizce veya Python)
      - `topic` (text) - Günlük çalışılacak konu detayı
      - `completed` (boolean) - Tamamlandı mı?
      - `created_at` (timestamptz)
    
    - `daily_tasks` - Günlük görevler (su, şınav, bacak esnetme)
      - `id` (uuid, primary key)
      - `date` (date) - Görev tarihi
      - `water_intake_ml` (integer) - İçilen su miktarı (mL)
      - `morning_pushups` (integer) - Sabah şınav sayısı
      - `evening_pushups` (integer) - Akşam şınav sayısı
      - `morning_leg_stretch` (boolean) - Sabah bacak esnetme
      - `noon_leg_stretch` (boolean) - Öğle bacak esnetme
      - `evening_leg_stretch` (boolean) - Akşam bacak esnetme
      - `created_at` (timestamptz)
    
    - `exam_nets` - TYT-AYT net takibi
      - `id` (uuid, primary key)
      - `date` (date) - Deneme tarihi
      - `exam_type` (text) - TYT veya AYT
      - `subject` (text) - Ders adı
      - `correct` (integer) - Doğru sayısı
      - `wrong` (integer) - Yanlış sayısı
      - `net` (decimal) - Net değeri
      - `created_at` (timestamptz)
    
    - `questions` - Sorular ve AI yanıtları
      - `id` (uuid, primary key)
      - `question` (text) - Sorulan soru
      - `answer` (text) - AI yanıtı
      - `sources` (jsonb) - Kaynak bilgileri (YouTube videoları vb.)
      - `created_at` (timestamptz)
    
    - `motivation_quotes` - Motivasyon sözleri
      - `id` (uuid, primary key)
      - `quote` (text) - Motivasyon sözü
      - `author` (text) - Yazar
      - `date` (date) - Gösterildiği tarih
      - `created_at` (timestamptz)

  2. Güvenlik
    - Tüm tablolar için RLS aktif
    - Public erişim politikaları (tek kullanıcılı sistem için)
*/

CREATE TABLE IF NOT EXISTS study_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number integer NOT NULL,
  day_number integer NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  water_intake_ml integer DEFAULT 0,
  morning_pushups integer DEFAULT 0,
  evening_pushups integer DEFAULT 0,
  morning_leg_stretch boolean DEFAULT false,
  noon_leg_stretch boolean DEFAULT false,
  evening_leg_stretch boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exam_nets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  exam_type text NOT NULL,
  subject text NOT NULL,
  correct integer DEFAULT 0,
  wrong integer DEFAULT 0,
  net decimal GENERATED ALWAYS AS (correct - (wrong::decimal / 4)) STORED,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sources jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS motivation_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text,
  date date UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE study_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_nets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE motivation_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to study_schedule"
  ON study_schedule FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to daily_tasks"
  ON daily_tasks FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to exam_nets"
  ON exam_nets FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to questions"
  ON questions FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to motivation_quotes"
  ON motivation_quotes FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_study_schedule_week_day ON study_schedule(week_number, day_number);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_date ON daily_tasks(date);
CREATE INDEX IF NOT EXISTS idx_exam_nets_date ON exam_nets(date);
CREATE INDEX IF NOT EXISTS idx_motivation_quotes_date ON motivation_quotes(date);