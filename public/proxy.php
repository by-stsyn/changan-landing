<?php
// Разрешаем браузеру читать данные
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/xml; charset=UTF-8");

$feed_url = "https://export.maxposter.ru/dealer-export/1983-38233.xml";

// Сохраняем кэш в системную папку хостинга (там всегда есть права на запись)
$cache_file = sys_get_temp_dir() . '/changan_feed_cache_fast.xml';
$cache_time = 1800; // Кэшируем на 30 минут

// 1. Если кэш существует и он свежий — отдаем его моментально (0.01 сек)
if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cache_time) {
    echo file_get_contents($cache_file);
    exit;
}

// 2. Иначе качаем заново
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $feed_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// ВАЖНО: Просим Макспостер сжать файл перед отправкой (ускоряет скачивание в 5-10 раз)
curl_setopt($ch, CURLOPT_ENCODING, ""); 
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
curl_setopt($ch, CURLOPT_TIMEOUT, 15);

$data = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($data && $http_code == 200) {
    // Сохраняем во временную папку
    @file_put_contents($cache_file, $data);
    echo $data;
} else {
    // Запасной вариант при сбое Макспостера
    if (file_exists($cache_file)) {
        echo file_get_contents($cache_file);
    } else {
        http_response_code(500);
        echo "<?xml version='1.0' encoding='UTF-8'?><error>Не удалось загрузить фид</error>";
    }
}
?>
