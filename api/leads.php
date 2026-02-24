<?php
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
  'ok' => true,
  'message' => 'This is a placeholder response from leads.php. Implement the backend logic as needed.'
], JSON_UNESCAPED_UNICODE);

exit;