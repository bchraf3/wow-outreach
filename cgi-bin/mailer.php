<?php
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: https://wowoutreach.co.za/index.php?success=-1#form");
        exit;  
    }

    $recipient = "outreachministry.wow@gmail.com";

    $subject = "New contact from $name";

    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Newsletter: Y\n\n";
    $email_content .= "Message:\n$message\n\n";

    $email_headers = "From: $name <$email>";

    mail($recipient, $subject, $email_content, $email_headers);

    header("Location: https://wowoutreach.co.za/index.php?success=1#form");

?>