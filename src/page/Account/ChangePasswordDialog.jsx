import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { useState } from "react";

function ChangePasswordDialog({ email, open, handleOpen }) {
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function handleChangePassword() {
    setSending(true);

    // Call api to reset password here, setSending = false and setSent = true after receiving the response
    // Ignore errors

    setTimeout(() => {
      setSending(false);
      setIsSent(true);
    }, 3000);
  }
  return (
    <Dialog
      open={open}
      size="xs"
      handler={handleOpen}
      dismiss={{ enabled: !sending }}
      className="p-3"
    >
      <DialogHeader>Change password</DialogHeader>
      <DialogBody>
        {!isSent
          ? "By clicking Confirm, we will you send you an email containing the link, you can use that link to change your password."
          : `Changing password link is sent, you may need to check your spam folder. 
          If you can not find the email, click Resend to send again.`}
      </DialogBody>
      <DialogFooter>
        {!isSent && !sending && (
          <Button
            size="sm"
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-2 normal-case"
          >
            <span>Cancel</span>
          </Button>
        )}
        <Button
          className="normal-case"
          size="sm"
          variant="gradient"
          color="blue"
          onClick={handleChangePassword}
          disabled={sending}
        >
          <span>{sending ? "Sending..." : isSent ? "Resend" : "Confirm"}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default ChangePasswordDialog;
