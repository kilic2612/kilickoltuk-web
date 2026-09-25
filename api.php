<?php
/**
 * Kılıç Koltuk Mobilya - JSON Flat-File Backend API
 * Bu dosya, MySQL veritabanı gerektirmeden yorumları ve atölye/Instagram fotoğraflarını yönetir.
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$reviewsFile = __DIR__ . '/reviews.json';
$instagramFile = __DIR__ . '/instagram.json';
$messagesFile = __DIR__ . '/messages.json';
$productsFile = __DIR__ . '/products.json';
$teslimatFile = __DIR__ . '/teslimat.json';

$defaultTeslimatlar = [];

// Varsayılan Ürünler Flat-File Veritabanı
$defaultProducts = [
    "koltuk-takimi" => [],
    "kose-takimi" => [],
    "tv-unitesi" => [],
    "yatak-odasi-koleksiyonu" => [],
    "cift-kisilik-yatak" => [],
    "tek-kisilik-yatak" => [],
    "yemek-masasi" => []
];

// Varsayılan Yorumlar (Eğer dosya yoksa otomatik oluşturulur)
$defaultReviews = [
    [
        "ad" => "Adil Öztürk",
        "stars" => 5,
        "text" => "Ali Bey ve ekibine çok teşekkür ederiz. Salonumuz için özel ölçü koltuk takımı yaptırdık. Tam istediğimiz ebatlarda, kumaş kalitesi ve dikişleri mükemmel şekilde Hatay'daki evimize teslim ettiler. Güvenle alışveriş yapabilirsiniz."
    ],
    [
        "ad" => "Mehmet Kemal Aslan",
        "stars" => 5,
        "text" => "Atölyeden teslimata kadar her süreç çok şeffaftı. Kumaş seçiminde sundukları renk kartelası ve VIP özel tasarım desteği sayesinde salonumuz adeta baştan yaratıldı. İskelet kalitesi gerçekten çok sağlam."
    ],
    [
        "ad" => "Selma Yıldız",
        "stars" => 5,
        "text" => "Çift kişilik yatak ve baza siparişi vermiştik. Hem yatak konforu hem de bazanın depolama alanı inanılmaz geniş ve kullanışlı. Hatay Antakya'daki yeni evimize getirip kurulumunu da kendileri yaptılar. Çok memnunuz."
    ]
];

// Varsayılan Instagram/Atölye Görselleri (Eğer dosya yoksa otomatik oluşturulur)
$defaultInstagram = [
    [
        "foto" => "images/milano-koltuk-takimi.jpg",
        "likes" => 284,
        "comments" => 24
    ],
    [
        "foto" => "images/atolye-milano-takim.jpg",
        "likes" => 195,
        "comments" => 18
    ],
    [
        "foto" => "images/milano-uclu-krem.jpg",
        "likes" => 230,
        "comments" => 15
    ],
    [
        "foto" => "images/koltuk-kapak.jpg",
        "likes" => 142,
        "comments" => 12
    ]
];

// Varsayılan İletişim Mesajları (Eğer dosya yoksa otomatik oluşturulur)
$defaultMessages = [
    [
        "ad" => "Demo Müşteri",
        "telefon" => "0538 602 90 31",
        "email" => "kilicadil2612@gmail.com",
        "mesaj" => "Demo iletişim mesajı. Bu alan gerçek müşteri talepleri ile doldurulacaktır.",
        "tarih" => date('Y-m-d H:i:s')
    ]
];

// Yardımcı Fonksiyonlar
function readJsonFile($filePath, $defaultData) {
    if (!file_exists($filePath)) {
        file_put_contents($filePath, json_encode($defaultData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $defaultData;
    }
    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    return is_array($data) ? $data : $defaultData;
}

function writeJsonFile($filePath, $data) {
    return file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Girdi Parametrelerini Al
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input) && isset($input['action'])) {
        $action = $input['action'];
    }
}

switch ($action) {
    // ----------------------------------------------------
    // 💬 YORUM ENDPOINTS
    // ----------------------------------------------------
    case 'get_reviews':
        $reviews = readJsonFile($reviewsFile, $defaultReviews);
        echo json_encode(["status" => "success", "data" => $reviews]);
        break;

    case 'add_review':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }
        
        $ad = isset($input['ad']) ? strip_tags(trim($input['ad'])) : '';
        $stars = isset($input['stars']) ? intval($input['stars']) : 5;
        $text = isset($input['text']) ? strip_tags(trim($input['text'])) : '';

        if (empty($ad) || empty($text)) {
            echo json_encode(["status" => "error", "message" => "Lütfen isim ve yorum alanlarını doldurun."]);
            break;
        }

        $reviews = readJsonFile($reviewsFile, $defaultReviews);
        $newReview = [
            "ad" => $ad,
            "stars" => min(5, max(1, $stars)),
            "text" => $text
        ];
        
        // Yorumun en başta çıkması için dizinin başına ekliyoruz
        array_unshift($reviews, $newReview);
        writeJsonFile($reviewsFile, $reviews);

        echo json_encode(["status" => "success", "message" => "Yorumunuz başarıyla eklendi!", "data" => $newReview]);
        break;

    case 'delete_review':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $index = isset($input['index']) ? intval($input['index']) : -1;
        $reviews = readJsonFile($reviewsFile, $defaultReviews);

        if ($index >= 0 && $index < count($reviews)) {
            array_splice($reviews, $index, 1);
            writeJsonFile($reviewsFile, $reviews);
            echo json_encode(["status" => "success", "message" => "Yorum silindi."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Geçersiz yorum index değeri."]);
        }
        break;

    // ----------------------------------------------------
    // 📸 INSTAGRAM / ATÖLYE GÖRSELLERİ ENDPOINTS
    // ----------------------------------------------------
    case 'get_instagram':
        $instagram = readJsonFile($instagramFile, $defaultInstagram);
        echo json_encode(["status" => "success", "data" => $instagram]);
        break;

    case 'add_instagram':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $foto = isset($input['foto']) ? $input['foto'] : '';
        $likes = isset($input['likes']) ? intval($input['likes']) : rand(50, 150);
        $comments = isset($input['comments']) ? intval($input['comments']) : rand(2, 15);

        if (empty($foto)) {
            echo json_encode(["status" => "error", "message" => "Lütfen bir fotoğraf seçin."]);
            break;
        }

        $instagram = readJsonFile($instagramFile, $defaultInstagram);
        $newItem = [
            "foto" => $foto,
            "likes" => $likes,
            "comments" => $comments
        ];

        // Yeni fotoğrafı başa ekle
        array_unshift($instagram, $newItem);
        writeJsonFile($instagramFile, $instagram);

        echo json_encode(["status" => "success", "message" => "Fotoğraf vitrine eklendi!", "data" => $newItem]);
        break;

    case 'delete_instagram':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $index = isset($input['index']) ? intval($input['index']) : -1;
        $instagram = readJsonFile($instagramFile, $defaultInstagram);

        if ($index >= 0 && $index < count($instagram)) {
            array_splice($instagram, $index, 1);
            writeJsonFile($instagramFile, $instagram);
            echo json_encode(["status" => "success", "message" => "Fotoğraf vitrinden silindi."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Geçersiz index değeri."]);
        }
        break;

    // ----------------------------------------------------
    // 📩 İLETİŞİM MESAJLARI ENDPOINTS
    // ----------------------------------------------------
    case 'get_messages':
        $messages = readJsonFile($messagesFile, $defaultMessages);
        echo json_encode(["status" => "success", "data" => $messages]);
        break;

    case 'add_message':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $ad = isset($input['ad']) ? strip_tags(trim($input['ad'])) : '';
        $telefon = isset($input['telefon']) ? strip_tags(trim($input['telefon'])) : '';
        $email = isset($input['email']) ? strip_tags(trim($input['email'])) : '';
        $mesaj = isset($input['mesaj']) ? strip_tags(trim($input['mesaj'])) : '';

        if (empty($ad) || empty($telefon) || empty($email) || empty($mesaj)) {
            echo json_encode(["status" => "error", "message" => "Lütfen isim, telefon, e-posta ve mesaj alanlarını doldurun."]);
            break;
        }

        $messages = readJsonFile($messagesFile, $defaultMessages);
        $newMessage = [
            "ad" => $ad,
            "telefon" => $telefon,
            "email" => $email,
            "mesaj" => $mesaj,
            "tarih" => date('Y-m-d H:i:s')
        ];

        array_unshift($messages, $newMessage);
        writeJsonFile($messagesFile, $messages);

        echo json_encode(["status" => "success", "message" => "Mesajınız başarıyla kaydedildi.", "data" => $newMessage]);
        break;

    case 'delete_message':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $index = isset($input['index']) ? intval($input['index']) : -1;
        $messages = readJsonFile($messagesFile, $defaultMessages);

        if ($index >= 0 && $index < count($messages)) {
            array_splice($messages, $index, 1);
            writeJsonFile($messagesFile, $messages);
            echo json_encode(["status" => "success", "message" => "Mesaj silindi."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Geçersiz mesaj index değeri."]);
        }
        break;

    // ----------------------------------------------------
    // 🛋️ ÜRÜN YÖNETİMİ ENDPOINTS (KALICI VERİTABANI)
    // ----------------------------------------------------
    case 'get_products':
        $products = readJsonFile($productsFile, $defaultProducts);
        echo json_encode(["status" => "success", "data" => $products]);
        break;

    case 'add_product':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $kat = isset($input['kategori']) ? trim($input['kategori']) : '';
        $ad = isset($input['ad']) ? strip_tags(trim($input['ad'])) : '';
        $aciklama = isset($input['aciklama']) ? strip_tags(trim($input['aciklama'])) : '';
        $foto = isset($input['foto']) ? $input['foto'] : '';
        $dosyaAdi = isset($input['dosyaAdi']) ? $input['dosyaAdi'] : '';

        if (empty($kat) || empty($ad) || empty($foto)) {
            echo json_encode(["status" => "error", "message" => "Kategori, ürün adı ve fotoğraf zorunludur."]);
            break;
        }

        // Base64 fotoğrafı uploads/ klasörüne gerçek dosya olarak kaydet (JSON şişmesini engeller)
        $fotoYolu = $foto;
        if (strpos($foto, 'data:image') === 0) {
            $uploadsDir = __DIR__ . '/uploads';
            if (!file_exists($uploadsDir)) {
                @mkdir($uploadsDir, 0777, true);
            }
            $ext = 'jpg';
            if (strpos($foto, 'data:image/png') === 0) $ext = 'png';
            elseif (strpos($foto, 'data:image/webp') === 0) $ext = 'webp';

            $cleanBase64 = preg_replace('#^data:image/\w+;base64,#i', '', $foto);
            $imgData = base64_decode($cleanBase64);
            if ($imgData !== false) {
                $safeName = 'urun_' . time() . '_' . rand(100, 999) . '.' . $ext;
                $targetPath = $uploadsDir . '/' . $safeName;
                if (file_put_contents($targetPath, $imgData)) {
                    $fotoYolu = 'uploads/' . $safeName;
                }
            }
        }

        $products = readJsonFile($productsFile, $defaultProducts);
        if (!isset($products[$kat]) || !is_array($products[$kat])) {
            $products[$kat] = [];
        }

        $newProduct = [
            "id" => "urun-" . time() . "-" . rand(100, 999),
            "ad" => $ad,
            "aciklama" => $aciklama,
            "foto" => $fotoYolu,
            "dosyaAdi" => $dosyaAdi ?: basename($fotoYolu),
            "eklenmeTarihi" => date('Y-m-d H:i:s')
        ];

        // Yeni eklenen ürünü en başa ekliyoruz
        array_unshift($products[$kat], $newProduct);
        writeJsonFile($productsFile, $products);

        echo json_encode(["status" => "success", "message" => "Ürün kalıcı olarak kaydedildi!", "data" => $newProduct]);
        break;

    case 'delete_product':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $kat = isset($input['kategori']) ? trim($input['kategori']) : '';
        $index = isset($input['index']) ? intval($input['index']) : -1;

        $products = readJsonFile($productsFile, $defaultProducts);
        if (isset($products[$kat]) && is_array($products[$kat]) && $index >= 0 && $index < count($products[$kat])) {
            array_splice($products[$kat], $index, 1);
            writeJsonFile($productsFile, $products);
            echo json_encode(["status" => "success", "message" => "Ürün kalıcı olarak silindi."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Geçersiz kategori veya ürün index değeri."]);
        }
        break;

    // ----------------------------------------------------
    // 🚚 TESLİMAT YÖNETİMİ ENDPOINTS (YAPILAN İŞLER)
    // ----------------------------------------------------
    case 'get_teslimatlar':
        $teslimatlar = readJsonFile($teslimatFile, $defaultTeslimatlar);
        echo json_encode(["status" => "success", "data" => $teslimatlar]);
        break;

    case 'add_teslimat':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $ilce = isset($input['ilce']) ? strip_tags(trim($input['ilce'])) : 'Hatay';
        $baslik = isset($input['baslik']) ? strip_tags(trim($input['baslik'])) : '';
        $aciklama = isset($input['aciklama']) ? strip_tags(trim($input['aciklama'])) : '';
        $foto = isset($input['foto']) ? $input['foto'] : '';

        if (empty($foto)) {
            echo json_encode(["status" => "error", "message" => "Teslimat fotoğrafı zorunludur."]);
            break;
        }

        // Base64 fotoğrafı uploads/ klasörüne gerçek dosya olarak kaydet
        $fotoYolu = $foto;
        if (strpos($foto, 'data:image') === 0) {
            $uploadsDir = __DIR__ . '/uploads';
            if (!file_exists($uploadsDir)) {
                @mkdir($uploadsDir, 0777, true);
            }
            $ext = 'jpg';
            if (strpos($foto, 'data:image/png') === 0) $ext = 'png';
            elseif (strpos($foto, 'data:image/webp') === 0) $ext = 'webp';

            $cleanBase64 = preg_replace('#^data:image/\w+;base64,#i', '', $foto);
            $imgData = base64_decode($cleanBase64);
            if ($imgData !== false) {
                $safeName = 'teslimat_' . time() . '_' . rand(100, 999) . '.' . $ext;
                $targetPath = $uploadsDir . '/' . $safeName;
                if (file_put_contents($targetPath, $imgData)) {
                    $fotoYolu = 'uploads/' . $safeName;
                }
            }
        }

        $teslimatlar = readJsonFile($teslimatFile, $defaultTeslimatlar);
        $newTeslimat = [
            "id" => "teslimat-" . time() . "-" . rand(100, 999),
            "ilce" => $ilce,
            "baslik" => $baslik ?: "Özel Ölçü Teslimat",
            "aciklama" => $aciklama,
            "foto" => $fotoYolu,
            "tarih" => date('Y-m-d H:i:s')
        ];

        array_unshift($teslimatlar, $newTeslimat);
        writeJsonFile($teslimatFile, $teslimatlar);

        echo json_encode(["status" => "success", "message" => "Teslimat başarıyla eklendi!", "data" => $newTeslimat]);
        break;

    case 'delete_teslimat':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            echo json_encode(["status" => "error", "message" => "POST method required"]);
            break;
        }

        $index = isset($input['index']) ? intval($input['index']) : -1;
        $teslimatlar = readJsonFile($teslimatFile, $defaultTeslimatlar);

        if ($index >= 0 && $index < count($teslimatlar)) {
            array_splice($teslimatlar, $index, 1);
            writeJsonFile($teslimatFile, $teslimatlar);
            echo json_encode(["status" => "success", "message" => "Teslimat silindi."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Geçersiz index değeri."]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Geçersiz işlem (Invalid action)."]);
        break;
}
