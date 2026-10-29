<?php
/**
 * Changan Feed Proxy & Optimizer for Pragmatika Changan (sale.pragmatika-changanauto.ru)
 * 
 * 1. Загружает свежий фид дилера из Maxposter (13.3 МБ, 1400+ авто всех брендов).
 * 2. Фильтрует на стороне сервера только автомобили марки Changan.
 * 3. Уменьшает размер ответа с 13.3 МБ до ~450 КБ (ускорение в 30 раз на мобильных устройствах).
 * 4. Кэширует отфильтрованный фид на 30 минут в системной временной папке хостинга Reg.ru.
 * 5. При недоступности Maxposter отдает кэш или локальный резервный changan-feed.xml.
 */

// Заголовки CORS и тип содержимого
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/xml; charset=UTF-8");
header("Cache-Control: public, max-age=900"); // Браузерный кэш на 15 минут

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$feed_url   = "https://export.maxposter.ru/dealer-export/1983-38233.xml";
$cache_file = sys_get_temp_dir() . '/changan_pragmatika_feed_cache.xml';
$cache_time = 1800; // 30 минут

// 1. Быстрая отдача из кэша (0.005 сек)
if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_time && filesize($cache_file) > 1000) {
    if (extension_loaded('zlib') && !ob_start("ob_gzhandler")) {
        ob_start();
    }
    readfile($cache_file);
    exit;
}

// 2. Функция фильтрации только Changan авто без перегрузки памяти
function filter_changan_vehicles($raw_xml) {
    $vehicles = [];
    $offset = 0;
    
    while (($start = strpos($raw_xml, '<vehicle>', $offset)) !== false) {
        $end = strpos($raw_xml, '</vehicle>', $start);
        if ($end === false) break;
        
        $block = substr($raw_xml, $start, ($end + 10) - $start);
        
        // Проверяем принадлежность к бренду Changan (регистронезависимо)
        if (stripos($block, '<brand>Changan</brand>') !== false || 
            stripos($block, '<brand>Чанган</brand>') !== false ||
            stripos($block, 'changan') !== false) {
            $vehicles[] = $block;
        }
        
        $offset = $end + 10;
    }
    
    if (empty($vehicles)) {
        return null;
    }
    
    $result = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    $result .= "<vehicles date=\"" . date('Y-m-d H:i:s') . "\" count=\"" . count($vehicles) . "\">\n";
    $result .= implode("\n", $vehicles);
    $result .= "\n</vehicles>";
    
    return $result;
}

// 3. Загрузка из Maxposter через cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $feed_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_ENCODING, ""); // Принимает gzip от Maxposter
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; PragmatikaChanganBot/1.0; +https://sale.pragmatika-changanauto.ru/)');
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 6);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$data = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$filtered_data = null;

if ($data && $http_code === 200 && strpos($data, '<vehicle>') !== false) {
    $filtered_data = filter_changan_vehicles($data);
    if ($filtered_data) {
        @file_put_contents($cache_file, $filtered_data);
    }
}

// Если удалось отфильтровать свежий фид
if ($filtered_data) {
    if (extension_loaded('zlib') && !ob_start("ob_gzhandler")) {
        ob_start();
    }
    echo $filtered_data;
    exit;
}

// 4. Резервный уровень 1: старый кэш хостинга
if (file_exists($cache_file) && filesize($cache_file) > 1000) {
    if (extension_loaded('zlib') && !ob_start("ob_gzhandler")) {
        ob_start();
    }
    readfile($cache_file);
    exit;
}

// 5. Резервный уровень 2: локальный статический changan-feed.xml рядом со скриптом
$local_feed = __DIR__ . '/changan-feed.xml';
if (file_exists($local_feed) && filesize($local_feed) > 1000) {
    if (extension_loaded('zlib') && !ob_start("ob_gzhandler")) {
        ob_start();
    }
    readfile($local_feed);
    exit;
}

// 6. Аварийный ответ
http_response_code(502);
echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Не удалось получить данные фида</error>";
