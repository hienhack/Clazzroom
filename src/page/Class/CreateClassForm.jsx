import {
  Card,
  CardBody,
  CardFooter,
  Input,
  Typography,
  Dialog,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { useState } from "react";

function CreateClassForm({ onSuccess, open, handleOpen }) {
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
            Create a new class
          </Typography>
          <div className="flex flex-col gap-6">
            <Input variant="standard" label="Class name *" size="lg" />
            <Input variant="standard" label="Room" size="lg" />
            <Input variant="standard" label="Topic" size="lg" />
            <Textarea variant="standard" label="Class description" />
          </div>
          <span className="text-xs text-blue-gray-300">
            {"(*) is required field"}
          </span>
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
              <span>Create</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Dialog>
  );
}

export default CreateClassForm;
