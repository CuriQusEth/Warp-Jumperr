# Base Denim 200ms Native Blocks & Proje Değişiklik Raporu (Warp Jumper)

Bu dokümanda, resmi Base dokümantasyonu (`https://docs.base.org/llms.txt` - *Migrate From Flashblocks to 200ms blocks*) doğrultusunda projede gerçekleştirilen tüm migrasyon adımları ve mimari güncellemeler yer almaktadır.

---

## 1. Flashblocks'tan 200ms Bloklara Migrasyon Tablosu

Denim yükseltmesi ile Flashblocks abonelikleri ve "pending" preconfirmation durumu kaldırılmıştır. Kod tabanında yapılan güncellemeler aşağıdaki gibidir:

| Eski Flashblocks Yapısı | Denim 200ms Canonical Karşılığı | Projedeki Durum |
| ----------------------- | ------------------------------ | --------------- |
| `eth_subscribe("newFlashblocks")` | `eth_subscribe("newHeads")` | `useDenim200msBlocks` ve Wagmi üzerinden canonical `newHeads` yapısına geçirildi. |
| `eth_subscribe("pendingLogs")` | `eth_subscribe("logs")` | Güncellendi. |
| `eth_subscribe("newFlashblockTransactions")` | `eth_subscribe("newHeads")` + canonical blok transaction çekimi | Tamamlandı. |
| `eth_getBlockByNumber("pending", ...)` | `eth_getBlockByNumber("latest", ...)` | `src/lib/denimRpc.ts` ve `src/lib/baseMcp.ts` içinde `"latest"` olarak zorunlu kılındı. |
| `eth_getBalance(..., "pending")` | `eth_getBalance(..., "latest")` | `readCanonicalBalance` fonksiyonunda `"latest"` uygulandı. |
| `eth_getTransactionCount(..., "pending", ...)` | `eth_getTransactionCount(..., "latest")` | `"latest"` uygulandı. |
| `eth_call(..., "pending")` | `eth_call(..., "latest")` | `readScoreViaMcp` fonksiyonunda `"latest"` kanonik etiketi kullanıldı. |
| `eth_estimateGas(..., "pending")` | `eth_estimateGas(..., "latest")` | `"latest"` uygulandı. |
| `eth_simulateV1(..., "pending")` | `eth_simulateV1(..., "latest")` | `"latest"` uygulandı. |
| `eth_getLogs` range bitişi `"pending"` | `eth_getLogs` range bitişi `"latest"` | Güncellendi. |
| `eth_getBlockTransactionCountByNumber("pending")` | `eth_getBlockTransactionCountByNumber("latest")` | Güncellendi. |

---

## 2. Base Vibenet & Ağ Destekleri
- **Base Vibenet (200ms Native Blocks Testnet):**
  - Chain ID: `84538453` (`0x52b61f5`)
  - RPC URL: `https://rpc.vibes.base.org`
  - WebSocket: `wss://rpc.vibes.base.org/ws`
  - Blok Süresi: 200 milisaniye (saniyede ~5 blok)
- **Base Sepolia:**
  - Chain ID: `84532` (Denim yükseltmesi 21 Ekim 2026 18:00 UTC'de aktif edildi)
- **Base Mainnet:**
  - Chain ID: `8453` (Kasım 2026 hedefli)

---

## 3. Tarihsel Blok Derinliği (Historical Block Depth) Hesaplaması
- 2 saniyelik bloklarda 100 blok ~200 saniyeyi (yaklaşık 3.3 dakikayı) kapsarken,
- 200ms kanonik bloklarda 100 blok yalnızca **20 saniyeyi** kapsar (10 kat daha hızlı blok üretimi).
- `src/lib/denimRpc.ts` içindeki `calculateDenimHistoricalBlocks(seconds)` fonksiyonu ile zaman aralıkları saniyede 5 blok baz alınarak otomatik olarak hesaplanmaktadır.

---

## 4. Kullanıcı Arayüzü & Canlı Blok Göstergesi
- `DenimStatusBadge`: Navbar üzerinde çalışan canlı 200ms kanonik blok sayacı, ortalama blok aralığı (ms) ve saniyedeki blok sayısını gösteren gerçek zamanlı bileşen eklendi.
- Ağ değiştirici (Network Switcher) ile kullanıcı Base Mainnet, Base Sepolia ve Base Vibenet arasında anında geçiş yapabilmektedir.

---

## 5. Bağımlılık ve Derleme Doğrulaması
- Wagmi, Viem ve TypeScript peer dependency çakışmaları çözüldü (`package.json`).
- `compile_applet` ile derleme hatasız bir şekilde tamamlandı.

---

## 7. Web3 Cüzdan Eklentileri Çakışma Düzeltmesi (`isZerion` TypeError)

- **Karşılaşılan Hata:**
  `TypeError: Cannot redefine property: isZerion at Object.defineProperty (<anonymous>) at in-page.js`
- **Nedeni:**
  Zerion, Rabby, MetaMask gibi tarayıcı eklentileri sayfaya injected provider eklerken `window.ethereum` veya `window` nesnesi üzerindeki `isZerion` vb. bayrakları `Object.defineProperty` ile tanımlamaya çalışır. Başka bir eklenti veya iframe ortamı aynı özelliği daha önce `configurable: false` olarak tanımladığında tarayıcı unhandled TypeError fırlatır.
- **Uygulanan Çözüm:**
  1. `index.html` dosyasının `<head>` bloğunun en başına erken çalışan güvenli bir `Object.defineProperty` polyfill'i ve extension hata filtresi eklendi (`chrome-extension://` kaynaklı çakışmalar bastırıldı).
  2. `src/components/ErrorBoundary.tsx` oluşturularak React uygulama ağacı korumaya alındı.
  3. `@types/react` ve `@types/react-dom` ile `src/vite-env.d.ts` eksiklikleri tamamlanarak TypeScript linter ve derleyici tam uyumlu hale getirildi.

---

## 8. Base Denim Mainnet (Chain ID 8453) Geçişi

- **Birincil Ağ Yapılandırması:**
  - Base Mainnet (`8453`) tüm uygulama için varsayılan ve birincil Denim ağı olarak ayarlandı.
  - RPC Uç Noktası: `https://mainnet.base.org` (yüksek performanslı, kanonik 200ms blok takibi).
- **Cüzdan Bağlantısı:**
  - Kullanıcı "Connect" butonuna bastığında varsayılan olarak Base Mainnet (`chainId: base.id` / `8453`) üzerinden bağlantı sağlanır.
- **Canlı Durum ve Gösterge (`DenimStatusBadge`):**
  - Navbar üzerindeki rozette "Base Mainnet - Denim Live (200ms)" birincil olarak vurgulandı.
  - Kullanıcı dilediğinde Sepolia veya Vibenet ağları arasında geçiş yapabilir; varsayılan ağ Base Mainnet'tir.
- **Kanonik 200ms Blok Uyumu:**
  - Base Mainnet üzerindeki tüm RPC çağrılarında (durum okuma, bakiye, skor sorgulama) `"latest"` kanonik etiketi geçerlidir; eski Flashblocks `"pending"` etiketleri tamamen kaldırılmıştır.

---

## 9. GitHub'a Gönderme (Push) Talimatı

Tüm değişiklikler yerel Git reposunda commit edilmiştir. Uzak repoya aktarmak için terminalinizde çalıştırabileceğiniz komutlar:

```bash
# Kişisel Erişim Jetonu (Personal Access Token - PAT) ile push:
git push https://<GITHUB_KULLANICI_ADI>:<GITHUB_TOKEN>@github.com/CuriQusEth/Warp-Jumperr.git main

# SSH yapılandırması olan ortamlar için:
git remote set-url origin git@github.com:CuriQusEth/Warp-Jumperr.git
git push -u origin main
```

