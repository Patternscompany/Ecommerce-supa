-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 7. Policies for Products
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin to insert products" ON products FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
CREATE POLICY "Allow admin to update products" ON products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
CREATE POLICY "Allow admin to delete products" ON products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 8. Policies for Orders
CREATE POLICY "Allow users to see their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Policies for Order Items
CREATE POLICY "Allow users to see their own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);
CREATE POLICY "Allow users to insert their own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- 10. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 11. Sample Products Insert
INSERT INTO products (name, description, price, category, image_url, stock)
VALUES 
('iPhone 14', 'Apple iPhone 14 with A15 Bionic chip and 128GB storage', 69999, 'Mobiles', 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=800&q=80', 50),
('Dell Inspiron 15', 'Dell laptop with Intel i5, 8GB RAM, 512GB SSD', 55999, 'Laptops', 'https://images.unsplash.com/photo-1593642632823-8f785bf67e45?auto=format&fit=crop&w=800&q=80', 30),
('Boat Rockerz 450', 'Wireless Bluetooth headphones with deep bass', 1499, 'Accessories', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 100),
('Samsung Galaxy S21', 'Samsung flagship phone with AMOLED display', 49999, 'Mobiles', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', 40);

