<?php
header('Content-Type: application/json; charset=utf-8');

function json_response(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

function env_value(string $key): string {
  $value = getenv($key);
  if (is_string($value) && $value !== '') {
    return $value;
  }

  if (isset($_ENV[$key]) && is_string($_ENV[$key]) && $_ENV[$key] !== '') {
    return $_ENV[$key];
  }

  $env_path = dirname(__DIR__) . '/.env';
  if (!is_readable($env_path)) {
    return '';
  }

  $lines = file($env_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  if ($lines === false) {
    return '';
  }

  foreach ($lines as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
      continue;
    }

    [$name, $raw_value] = explode('=', $line, 2);
    if (trim($name) === $key) {
      return trim($raw_value, " \t\n\r\0\x0B\"'");
    }
  }

  return '';
}

function post_recaptcha_siteverify(array $payload): array {
  $body = http_build_query($payload);
  $url = 'https://www.google.com/recaptcha/api/siteverify';

  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_POSTFIELDS => $body,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_TIMEOUT => 5,
      CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ]);

    $raw = curl_exec($ch);
    if ($raw === false) {
      $error = curl_error($ch);
      curl_close($ch);
      throw new RuntimeException($error);
    }

    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status < 200 || $status >= 300) {
      throw new RuntimeException("HTTP {$status}");
    }
  } else {
    $context = stream_context_create([
      'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $body,
        'timeout' => 5,
      ],
    ]);

    $raw = file_get_contents($url, false, $context);
    if ($raw === false) {
      throw new RuntimeException('Errore richiesta reCAPTCHA');
    }
  }

  $data = json_decode($raw, true);
  if (!is_array($data)) {
    throw new RuntimeException('Risposta reCAPTCHA non valida');
  }

  return $data;
}

function verify_recaptcha(?string $token): void {
  $secret = env_value('RECAPTCHA_SECRET_KEY');
  if ($secret === '') {
    return;
  }

  if (!is_string($token) || trim($token) === '') {
    json_response(400, [
      'success' => false,
      'error' => 'Conferma il reCAPTCHA.',
    ]);
  }

  $payload = [
    'secret' => $secret,
    'response' => $token,
  ];

  if (!empty($_SERVER['REMOTE_ADDR'])) {
    $payload['remoteip'] = $_SERVER['REMOTE_ADDR'];
  }

  try {
    $result = post_recaptcha_siteverify($payload);
  } catch (Throwable $error) {
    error_log('reCAPTCHA verification failed: ' . $error->getMessage());
    json_response(502, [
      'success' => false,
      'error' => 'Verifica reCAPTCHA non disponibile. Riprova.',
    ]);
  }

  if (($result['success'] ?? false) !== true) {
    json_response(400, [
      'success' => false,
      'error' => 'Verifica reCAPTCHA non riuscita.',
    ]);
  }
}

$raw_body = file_get_contents('php://input');
$payload = json_decode($raw_body ?: '', true);
if (!is_array($payload)) {
  json_response(400, [
    'success' => false,
    'error' => 'Richiesta non valida.',
  ]);
}

verify_recaptcha($payload['recaptchaToken'] ?? null);
unset($payload['recaptchaToken']);

json_response(200, [
  'success' => true,
  'message' => 'This is a placeholder response from leads.php. Implement the backend logic as needed.'
]);

exit;
