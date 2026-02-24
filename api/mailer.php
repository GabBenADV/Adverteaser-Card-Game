<?php
// api/mailer.php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../vendor/autoload.php';

function send_lead_email_phpmailer(string $email, string $category): void
{
    $to = 'gabriele.benasso@adverteaser.com';

    $subject = "Nuova richiesta FocusPanel: {$category}";
    $body = "Nuova richiesta dal FocusPanel\n\n"
          . "Email: {$email}\n"
          . "Categoria: {$category}\n"
          . "Data: " . date('c') . "\n"
          . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

    $mail = new PHPMailer(true);

    try {
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host = 'pro.eu.turbo-smtp.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'caf924c521d1da9ff439';
        $mail->Password = 'lzVKsZoi08bqJhyx4fU7';
        $mail->Port = 587;
        $mail->SMTPSecure = 'tls';

        // Debug SMTP (solo in dev)
        // 0 = off, 2 = verbose
        $mail->SMTPDebug = 0;

        $mail->setFrom('gabriele.benasso@adverteaser.com', 'Gabriele Benasso');
        $mail->addAddress($to);

        // Reply-To: l’email inserita dall’utente (così rispondi direttamente)
        $mail->addReplyTo($email);

        $mail->Subject = $subject;
        $mail->Body = $body;

        $mail->send();
    } catch (Exception $e) {
        // In produzione meglio loggare, non mostrare a schermo
        throw new RuntimeException('Mailer error: ' . $mail->ErrorInfo);
    }
}
