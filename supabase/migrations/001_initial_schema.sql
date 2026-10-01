-- profiles
CREATE TABLE profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  age         INT NOT NULL CHECK (age BETWEEN 13 AND 100),
  gender      TEXT NOT NULL CHECK (gender IN ('male','female','non-binary')),
  height_cm   NUMERIC NOT NULL CHECK (height_cm BETWEEN 100 AND 250),
  weight_kg   NUMERIC NOT NULL CHECK (weight_kg BETWEEN 25 AND 250),
  shoulder_cm NUMERIC NOT NULL CHECK (shoulder_cm BETWEEN 20 AND 70),
  chest_cm    NUMERIC NOT NULL CHECK (chest_cm BETWEEN 50 AND 180),
  waist_cm    NUMERIC NOT NULL CHECK (waist_cm BETWEEN 40 AND 160),
  hip_cm      NUMERIC NOT NULL CHECK (hip_cm BETWEEN 50 AND 180),
  photo_public_id TEXT,
  photo_url       TEXT,
  consent_given   BOOLEAN NOT NULL DEFAULT false,
  consent_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- avatars
CREATE TABLE avatars (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  face_public_id  TEXT,
  face_url        TEXT,
  body_public_id  TEXT,
  body_url        TEXT,
  body_parameters JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- dress_links
CREATE TABLE dress_links (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_url          TEXT,
  dress_public_id     TEXT,
  dress_image_url     TEXT,
  processed_image_url TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
);

-- try_on_results
CREATE TABLE try_on_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar_id       UUID REFERENCES avatars(id) ON DELETE CASCADE,
  dress_link_id   UUID REFERENCES dress_links(id) ON DELETE SET NULL,
  result_public_id TEXT,
  result_url       TEXT,
  estimated_size   TEXT,
  fit_notes        TEXT,
  is_saved         BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE dress_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE try_on_results ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

-- Avatars Policies
CREATE POLICY "Users can view their own avatars" ON avatars FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own avatars" ON avatars FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own avatars" ON avatars FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own avatars" ON avatars FOR DELETE USING (auth.uid() = user_id);

-- Dress Links Policies
CREATE POLICY "Users can view their own dress links" ON dress_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own dress links" ON dress_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dress links" ON dress_links FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dress links" ON dress_links FOR DELETE USING (auth.uid() = user_id);

-- Try On Results Policies
CREATE POLICY "Users can view their own try on results" ON try_on_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own try on results" ON try_on_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own try on results" ON try_on_results FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own try on results" ON try_on_results FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_avatars_user_id ON avatars(user_id);
CREATE INDEX idx_dress_links_user_id ON dress_links(user_id);
CREATE INDEX idx_try_on_results_user_id ON try_on_results(user_id);
CREATE INDEX idx_try_on_results_created_at ON try_on_results(user_id, created_at);
CREATE INDEX idx_try_on_results_is_saved ON try_on_results(user_id, is_saved);
