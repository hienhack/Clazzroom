import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Dialog,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

function JoinClassForm({ onSuccess, open, handleOpen }) {
  const [processing, setProcessing] = useState(false);

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto p-2 w-full">
        <CardBody className="flex flex-col gap-4">
          <Typography className="mb-3" variant="h4" color="blue-gray">
            Join a class
          </Typography>
          <div className="flex flex-col gap-6">
            <h1 className="text-sm">
              Enter your class code below to join your class
            </h1>
            <Input variant="standard" label="Class code" size="lg" />
          </div>
        </CardBody>
        <CardFooter className="pt-0 mt-2">
          <div className="flex justify-end items-center gap-2">
            <Button
              size="sm"
              variant="text"
              color="red"
              onClick={handleOpen}
              className="normal-case rounded-md"
            >
              <span>Cancel</span>
            </Button>
            <Button
              className="normal-case rounded-md"
              size="sm"
              variant="gradient"
              color="blue"
            >
              <span>Join</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default JoinClassForm;
