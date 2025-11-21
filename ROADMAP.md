# 👗 Loop: AI Destekli Akıllı Gardırop & Takas Uygulaması

Bu proje, kullanıcıların gardıroplarını dijitalleştirmelerine, yapay zeka destekli kombin önerileri almalarına ve kullanmadıkları kıyafetleri takas etmelerine olanak tanıyan bir React Native mobil uygulamasıdır.

## 🛠 Teknoloji Yığını (Tech Stack)

- **Framework:** React Native (CLI veya Expo)
- **Dil:** TypeScript / JavaScript
- **State Management:** Zustand veya Redux Toolkit
- **Navigasyon:** React Navigation
- **Backend & Database:** Firebase (Auth, Firestore, Storage) veya Supabase
- **AI & Görüntü İşleme:**
  - Background Removal API (remove.bg veya benzeri)
  - OpenAI Vision API veya TensorFlow Lite (Kıyafet tanıma ve etiketleme için)
- **UI Kütüphanesi:** React Native Paper veya NativeBase

---

## 🚀 Geliştirme Yol Haritası (Roadmap)

Bu dosya projenin ilerleyişini takip etmek için kullanılacaktır. Tamamlanan maddeler işaretlenecektir.

### Faz 1: Proje Kurulumu ve Temel Yapı (Setup)

- [x] React Native projesinin oluşturulması (Init).
- [x] Klasör yapısının düzenlenmesi (`src/components`, `src/screens`, `src/navigation`, `src/assets`).
- [x] React Navigation kurulumu (Stack & Tab Navigator).
- [x] Temel UI tema (renkler, fontlar) ayarları.
- [x] Linter ve Prettier kurallarının belirlenmesi.

### Faz 2: Kimlik Doğrulama ve Onboarding (Auth)

- [x] Login (Giriş) ekranı tasarımı ve kodlanması.
- [x] Register (Kayıt) ekranı tasarımı ve kodlanması.
- [x] Firebase/Backend Authentication entegrasyonu (Email & Google Auth).
- [x] **Onboarding Akışı:** Kullanıcının beden, tarz ve renk tercihlerini alan anket ekranları.
- [x] Kullanıcı profili oluşturma ve veritabanına kaydetme.

### Faz 3: Gardırop Dijitalleştirme (Core Feature A)

- [x] Kamera ve Galeri izinlerinin ayarlanması.
- [x] **Fotoğraf Yükleme Ekranı:** Fotoğraf çekme/seçme işlevi.
- [x] **AI Entegrasyonu 1 (Dekupe):** Seçilen fotoğrafın arka planını temizleyen API servisine bağlanma.
- [x] **Etiketleme Sistemi:** Kıyafetin kategorisini (Pantolon, Gömlek vb.) seçme veya AI ile otomatik algılama.
- [x] **Gardırop Vitrini:** Yüklenen kıyafetlerin "Dolabım" sekmesinde Grid şeklinde listelenmesi.
- [x] Kıyafet detay ve düzenleme sayfası.

### Faz 4: AI Stilist ve Kombin (Core Feature B)

- [x] **Hava Durumu Entegrasyonu:** Konum bazlı hava durumu verisi çekme (Mock/API).
- [x] **Kombin Algoritması:** Hava durumu ve kıyafet özelliklerine göre basit öneri motoru.
- [x] **Ana Sayfa (Dashboard):** "Bugün Ne Giysem?" kartı ve hava durumu widget'ı.
- [x] **Kombin Ekranı:** Önerilen kombinin detaylı gösterimi ve "Bunu Giy" seçeneği.ği (Sürükle-bırak veya seç-ekle).

### Faz 5: Takas ve Keşfet (Marketplace)

- [x] **Keşfet Akışı (Tinder Style):** Başka kullanıcıların takaslık ürünlerini kartlar halinde gösterme (Sağa/Sola kaydırma).
- [x] Filtreleme sistemi (Beden, Kategori, Konum).
- [x] Ürün detay sayfası (Takas teklif et butonu).
- [x] "Takaslarım" ekranı (Gelen ve giden teklifler).

### Faz 6: Mesajlaşma ve Sosyal (Social)

- [x] Eşleşme sonrası sohbet ekranı (Chat UI).
- [x] Real-time mesajlaşma altyapısı (Firestore/Socket.io).
- [x] Bildirim sistemi (Push Notifications) - "Yeni bir eşleşmen var!".

### Faz 7: Monetization & Final Kontroller

- [x] Premium üyelik ekranı ve kısıtlamalar (Örn: 20 parça sınırı).
- [x] Uygulama içi satın alma (IAP) entegrasyonu hazırlığı.
- [x] Ayarlar sayfası (Profil düzenleme, çıkış yap).
- [x] Test süreçleri (iOS ve Android simülatör testleri).
- [x] Bug fix ve performans iyileştirmeleri.

### Faz 8: Backend & AI Entegrasyonu (Production Ready)

#### 8.1: Gemini AI Kurulumu
- [ ] Gemini API key alma (Google AI Studio).
- [ ] `src/config/env.ts` dosyasına API key ekleme.
- [x] `.gitignore` dosyasına `env.ts` ekleme (güvenlik).
- [x] `geminiService.ts` dosyasını `env.ts` kullanacak şekilde güncelleme.
- [ ] Gemini AI servisini test etme (kıyafet analizi).


#### 8.2: Background Removal Servisi
- [ ] remove.bg API key alma.
- [ ] `imageService.ts` dosyasını güncelleme (gerçek API entegrasyonu).
- [ ] Background removal özelliğini test etme.

#### 8.3: Firebase Backend Kurulumu
- [ ] Firebase projesi oluşturma (Console'da manuel).
- [x] Firebase SDK kurulumu ve yapılandırması.
- [x] Firebase Authentication servisi (`authService.ts`).
- [x] Firestore Database servisleri (`wardrobeService.ts`, `marketplaceService.ts`).
- [x] Firebase Storage kurulumu (fotoğraf yükleme).
- [x] Real-time mesajlaşma servisi (`chatService.ts`).
- [x] `FIREBASE_SETUP.md` dokümantasyonu.
- [x] Firebase config dosyasına credentials ekleme.
- [x] Auth ekranlarını Firebase'e bağlama.



#### 8.4: Real-time Özellikler
- [ ] Firestore ile real-time mesajlaşma entegrasyonu.
- [ ] Trade offers için real-time güncellemeler.
- [ ] Push Notifications kurulumu (Firebase Cloud Messaging).

#### 8.5: Test & Doğrulama
- [ ] Tüm ekranları iOS simülatörde test etme.
- [ ] Tüm ekranları Android emülatörde test etme.
- [ ] AI özelliklerini gerçek verilerle test etme.
- [ ] Performance optimizasyonu ve bug fixes.

---

## 📂 Klasör Yapısı (Örnek)
