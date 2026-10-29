import test from "node:test";
import assert from "node:assert/strict";
import { formatPhoneNumber, isPhoneValid } from "./phoneMask";
import {
  formatBodyType,
  formatTransmission,
  formatColor,
  formatEngineVolume,
} from "./format";
import {
  normalizeCalltouchPhone,
  buildCalltouchParams,
} from "../components/calltouch";

test("phone formatting and validation requires full 11 digits", () => {
  assert.equal(formatPhoneNumber("9"), "+7 (9");
  assert.equal(isPhoneValid("+7 (9"), false);
  assert.equal(isPhoneValid("+7 (999) 123-45"), false);

  const formatted = formatPhoneNumber("9991234567");
  assert.equal(formatted, "+7 (999) 123-45-67");
  assert.equal(isPhoneValid(formatted), true);
});

test("Calltouch payload omits null sessionId and normalizes phone to digits", () => {
  assert.equal(normalizeCalltouchPhone("+7 (999) 123-45-67"), "79991234567");
  assert.equal(normalizeCalltouchPhone("89991234567"), "79991234567");

  const paramsWithoutSession = buildCalltouchParams({
    fio: "Иван",
    phone: "+7 (999) 123-45-67",
    subject: "Changan Купчино | Тест",
    comment: "Комментарий",
    tags: "changan_kupchino",
    requestUrl: "https://sale.pragmatika-changanauto.ru/",
    sessionId: null,
    utm: { utm_source: "yandex", utm_medium: "cpc" },
  });

  assert.equal(paramsWithoutSession.has("sessionId"), false);
  assert.equal(paramsWithoutSession.get("phoneNumber"), "79991234567");
  assert.equal(paramsWithoutSession.get("tags"), "changan_kupchino,yandex,cpc");

  const paramsWithSession = buildCalltouchParams({
    fio: "Иван",
    phone: "+7 (999) 123-45-67",
    subject: "Changan Купчино | Тест",
    sessionId: "12345678",
  });

  assert.equal(paramsWithSession.get("sessionId"), "12345678");
});

test("vehicle attribute localization converts raw feed values to Russian", () => {
  assert.equal(formatBodyType("suv"), "Внедорожник");
  assert.equal(formatBodyType("liftback"), "Лифтбек");
  assert.equal(formatBodyType("pickup"), "Пикап");
  assert.equal(formatTransmission("robotized"), "Робот");
  assert.equal(formatTransmission("automatic"), "Автомат");
  assert.equal(formatColor("red"), "Красный");
  assert.equal(formatColor("silver"), "Серебристый");
  assert.equal(formatColor("grey"), "Серый");
  assert.equal(formatEngineVolume("1494"), "1.5 л");
  assert.equal(formatEngineVolume(1987), "2.0 л");
});

test("deployment configuration includes .htaccess SPA routing and proxy rules", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");

  // Verify .htaccess exists in public and contains SPA rewrite & proxy.php rule
  const htaccessPublic = fs.readFileSync(path.resolve(process.cwd(), "public/.htaccess"), "utf-8");
  assert.match(htaccessPublic, /RewriteEngine\s+On/i);
  assert.match(htaccessPublic, /proxy\.php/i);
  assert.match(htaccessPublic, /index\.html/i);

  // Verify proxy.php exists in public and has Changan filtering
  const proxyContent = fs.readFileSync(path.resolve(process.cwd(), "public/proxy.php"), "utf-8");
  assert.match(proxyContent, /filter_changan_vehicles/);
  assert.match(proxyContent, /maxposter\.ru/);
  assert.match(proxyContent, /changan-feed\.xml/);

  // Verify .gitignore exists and ignores node_modules and .env
  const gitignoreContent = fs.readFileSync(path.resolve(process.cwd(), ".gitignore"), "utf-8");
  assert.match(gitignoreContent, /node_modules\//);
  assert.match(gitignoreContent, /\.env/);
});

