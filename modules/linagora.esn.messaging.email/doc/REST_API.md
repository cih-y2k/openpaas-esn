# /api/messages/email/reply

## POST /api/messages/email/reply

Post a new comment in reply to a message, by the currently logged in user.
This is used by platform applications to reply to a message from an incoming email.

Note: The incoming message is in rfc822 MIME form.

**Request Headers:**

- Content-Type: message/rfc822
- x-esn-email-to-reply-from: The sender's email
- x-esn-email-to-reply-to: The email target. This is used to retrieve the message to reply to.

**Request text:**

An email in rfc822 MIME format.

**Status Codes:**

- 201 Created. With the id of the new message.
- 400 Bad request. The current request is missing mandatory parameters
- 403 Forbidden. The current user is not allowed to reply to the given message.
- 500 Internal server error.

**Request:**

    POST /api/messages/email/reply
    Content-Type: message/rfc822
    x-esn-email-to-reply-from: bruce@willis.com
    x-esn-email-to-reply-to: 98298-09883-62729-8266288@open-paas.org
    Host: localhost:8080

    From: 'Bruce Willis' <bruce@willis.com>
    To: 'OpenPaaS Reply Bot' <98298-09883-62729-8266288@open-paas.org>
    Subject: Re: New message from Chuck Norris

    This is nice. Thanks!

**Response:**

    HTTP/1.1 201 Created
    {
        "_id": "'7f281054935d5b88389d",
        "parentId": "5493fb74e9ce80dd0b91f64d"
    }

## GET /api/messages/email/check

Check that the sender and the recipient are valid ie that the user can reply to the message.

**Query parameters:**

- from: The email address of the sender. This email address must be an address of a user in the ESN.
- to: The recipient email address. This email address has been generated by the ESN.

**Status Codes:**

- 200 OK. The user can reply to the given message.
- 400 Bad request. The current request is missing mandatory parameters
- 403 Forbidden. The current user is not allowed to reply to the given message.
- 404 Not found. The user or message does not match any resource in the platform.
- 500 Internal server error.

**Request:**

    GET /api/messages/email/reply/check?from=bruce@willis.com&to=98298-09883-62729-8266288@open-paas.org
    Host: localhost:8080

**Response:**

    HTTP/1.1 200 OK
