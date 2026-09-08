//* format date
const formatDate = (date: NativeDate) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

//* generateAccountCreatedHtml
export const generateAccountCreatedHtml = ({
  full_name,
  email,
  created_at,
  user_agent = "unknown",
}: {
  full_name: string;
  email: string;
  created_at: NativeDate;
  user_agent?: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Account Created</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #fff5f2;
          font-family: Arial, Helvetica, sans-serif;
          color: #2d2d2d;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background-color: #fff5f2; padding: 40px 16px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  border: 1px solid #ffe0d8;
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #ff6347;
                      padding: 28px 32px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                        line-height: 1.3;
                      "
                    >
                      Account Created
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Hi <strong>${full_name}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #555555;
                      "
                    >
                      Your account has been successfully created. Here are
                      the details associated with your account:
                    </p>

                    <!-- Account Details -->
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background-color: #fff5f2;
                        border: 1px solid #ffe0d8;
                        border-radius: 8px;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 16px 18px;
                            border-bottom: 1px solid #ffe0d8;
                          "
                        >
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Name
                          </span>
                          <strong style="font-size: 14px;">
                            ${full_name}
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 16px 18px;
                            border-bottom: 1px solid #ffe0d8;
                          "
                        >
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Email
                          </span>
                          <strong style="font-size: 14px;">
                            ${email}
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 16px 18px;
                            border-bottom: 1px solid #ffe0d8;
                          "
                        >
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Created At
                          </span>
                          <strong style="font-size: 14px;">
                            ${formatDate(created_at)}
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 16px 18px;">
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            User Agent
                          </span>
                          <span
                            style="
                              display: block;
                              font-size: 13px;
                              line-height: 1.5;
                              word-break: break-word;
                              color: #555555;
                            "
                          >
                            ${user_agent}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 24px 0 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #666666;
                      "
                    >
                      If you did not create this account, please contact
                      support immediately.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding: 20px 32px;
                      background-color: #fffaf8;
                      border-top: 1px solid #ffe0d8;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        color: #999999;
                        font-size: 12px;
                        line-height: 1.5;
                      "
                    >
                      This is an automated notification. Please do not reply
                      to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return html;
};

//* generate new login detected Html
export const generateLoginDetectedHtml = ({
  full_name,
  email,
  logged_in_at,
  user_agent = "unknown",
}: {
  full_name: string;
  email: string;
  logged_in_at: NativeDate;
  user_agent?: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>New Login Detected</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #fff5f2;
          font-family: Arial, Helvetica, sans-serif;
          color: #2d2d2d;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background-color: #fff5f2; padding: 40px 16px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border: 1px solid #ffe0d8;
                  border-radius: 12px;
                  overflow: hidden;
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #ff6347;
                      padding: 28px 32px;
                      text-align: center;
                    "
                  >
                    <div
                      style="
                        font-size: 38px;
                        line-height: 1;
                        margin-bottom: 10px;
                      "
                    >
                      🔐
                    </div>

                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                        line-height: 1.3;
                      "
                    >
                      New Login Detected
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Hi <strong>${full_name}</strong>,
                    </p>

                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #555555;
                      "
                    >
                      We detected a new login to your account. If this was
                      you, no action is required.
                    </p>

                    <!-- Login Details -->
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background-color: #fff5f2;
                        border: 1px solid #ffe0d8;
                        border-radius: 8px;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 16px 18px;
                            border-bottom: 1px solid #ffe0d8;
                          "
                        >
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Account
                          </span>

                          <strong style="font-size: 14px;">
                            ${email}
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 16px 18px;
                            border-bottom: 1px solid #ffe0d8;
                          "
                        >
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Login Time
                          </span>

                          <strong style="font-size: 14px;">
                            ${formatDate(logged_in_at)}
                          </strong>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding: 16px 18px;">
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Device / Browser
                          </span>

                          <span
                            style="
                              display: block;
                              font-size: 13px;
                              line-height: 1.5;
                              color: #555555;
                              word-break: break-word;
                            "
                          >
                            ${user_agent}
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Security Warning -->
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        margin-top: 24px;
                        background-color: #fff1ed;
                        border-left: 4px solid #ff6347;
                      "
                    >
                      <tr>
                        <td style="padding: 16px;">
                          <p
                            style="
                              margin: 0;
                              font-size: 14px;
                              line-height: 1.6;
                              color: #7a3022;
                            "
                          >
                            <strong>Wasn't you?</strong><br />
                            If you don't recognize this login, secure your
                            account immediately by changing your password and
                            reviewing your recent account activity.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 24px 0 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #666666;
                      "
                    >
                      Your account security is important to us. We recommend
                      using a strong, unique password and enabling
                      two-factor authentication.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding: 20px 32px;
                      background-color: #fffaf8;
                      border-top: 1px solid #ffe0d8;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        color: #999999;
                        font-size: 12px;
                        line-height: 1.5;
                      "
                    >
                      This is an automated security notification.
                      Please do not reply to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return html;
};

//* forgot password send otp

export const forgotPasswordOtpSendHtml = ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset OTP</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="padding: 40px 15px;"
        >
          <tr>
            <td align="center">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width: 520px;
                  background: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                "
              >
                <!-- Header -->
                <tr>
                  <td style="
                    background-color: #ff6347;
                    padding: 28px 20px;
                    text-align: center;
                  ">
                    <h1 style="
                      margin: 0;
                      color: #ffffff;
                      font-size: 26px;
                    ">
                      Password Reset
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 35px 30px;">
                    <p style="
                      margin: 0 0 15px;
                      color: #333333;
                      font-size: 16px;
                      line-height: 1.6;
                    ">
                      Hello,
                    </p>

                    <p style="
                      margin: 0 0 20px;
                      color: #555555;
                      font-size: 15px;
                      line-height: 1.6;
                    ">
                      We received a request to reset the password for
                      <strong>${email}</strong>.
                      Use the OTP below to continue.
                    </p>

                    <!-- OTP -->
                    <div style="
                      margin: 30px 0;
                      padding: 20px;
                      background-color: #fff4f1;
                      border: 1px solid #ff6347;
                      border-radius: 8px;
                      text-align: center;
                    ">
                      <p style="
                        margin: 0 0 8px;
                        color: #777777;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      ">
                        Your OTP
                      </p>

                      <div style="
                        color: #ff6347;
                        font-size: 36px;
                        font-weight: bold;
                        letter-spacing: 8px;
                      ">
                        ${otp}
                      </div>
                    </div>

                    <p style="
                      margin: 0 0 10px;
                      color: #555555;
                      font-size: 14px;
                      line-height: 1.6;
                    ">
                      This OTP is valid for a limited time. Please do not
                      share it with anyone.
                    </p>

                    <p style="
                      margin: 25px 0 0;
                      color: #888888;
                      font-size: 13px;
                      line-height: 1.6;
                    ">
                      If you didn't request a password reset, you can safely
                      ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="
                    padding: 20px 30px;
                    background-color: #fafafa;
                    border-top: 1px solid #eeeeee;
                    text-align: center;
                  ">
                    <p style="
                      margin: 0;
                      color: #999999;
                      font-size: 12px;
                    ">
                      © ${new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return html;
};


//* change email send otp
//* changeEmailOtpSendHtml
export const changeEmailOtpSendHtml = ({
  otp,
  email,
  requested_at,
}: {
  otp: string;
  email: string;
  requested_at: NativeDate;
}) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your New Email Address</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #fff5f2;
          font-family: Arial, Helvetica, sans-serif;
          color: #2d2d2d;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background-color: #fff5f2; padding: 40px 16px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 600px;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  border: 1px solid #ffe0d8;
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    style="
                      background-color: #ff6347;
                      padding: 28px 32px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 26px;
                        line-height: 1.3;
                      "
                    >
                      Verify Your New Email
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <p
                      style="
                        margin: 0 0 16px;
                        font-size: 16px;
                        line-height: 1.6;
                      "
                    >
                      Hi there,
                    </p>

                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 15px;
                        line-height: 1.7;
                        color: #555555;
                      "
                    >
                      We received a request to change the email address for your account to <strong>${email}</strong>. Please use the verification code below to confirm this change:
                    </p>

                    <!-- OTP Code Box -->
                    <div
                      style="
                        background-color: #fff5f2;
                        border: 2px dashed #ff6347;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        color: #ff6347;
                        margin: 24px 0;
                      "
                    >
                      ${otp}
                    </div>

                    <!-- Details Table -->
                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background-color: #fffaf8;
                        border: 1px solid #ffe0d8;
                        border-radius: 8px;
                      "
                    >
                      <tr>
                        <td style="padding: 16px 18px;">
                          <span
                            style="
                              display: block;
                              color: #888888;
                              font-size: 12px;
                              margin-bottom: 5px;
                            "
                          >
                            Requested At
                          </span>
                          <strong style="font-size: 14px;">
                            ${formatDate(requested_at)}
                          </strong>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        margin: 24px 0 0;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #666666;
                      "
                    >
                      If you did not request this update, please ignore this email or change your security credentials immediately.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding: 20px 32px;
                      background-color: #fffaf8;
                      border-top: 1px solid #ffe0d8;
                      text-align: center;
                    "
                  >
                    <p
                      style="
                        margin: 0;
                        color: #999999;
                        font-size: 12px;
                        line-height: 1.5;
                      "
                    >
                      This is an automated notification. Please do not reply
                      to this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
  return html;
};
