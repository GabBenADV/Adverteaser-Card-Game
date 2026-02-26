<?php
header('Content-Type: application/json; charset=utf-8');

function json_response(int $code, array $payload): void {
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

json_response(200, [
  'success' => true,
  'message' => 'This is a placeholder response from leads.php. Implement the backend logic as needed.'
]);

exit;